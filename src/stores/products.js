import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import { loadOrSeed, save } from '@/utils/storage'
import { useAuthStore } from '@/stores/auth'
import productseed from '@/seed/products.json'

const KEY = 'ikoma_products'

// ── Helper status stok (diekspor agar bisa dipakai komponen) ─────────────────
/**
 * @param {{ stock: number, min_stock: number }} product
 * @returns {{ label: string, variant: 'danger'|'warning'|'success' }}
 */
export function getStockStatus(product) {
  if (product.stock === 0)                return { label: 'Habis',   variant: 'danger'  }
  if (product.stock <= product.min_stock) return { label: 'Menipis', variant: 'warning' }
  return                                         { label: 'Aman',    variant: 'success' }
}

export const useProductsStore = defineStore('products', () => {
  const products = ref(loadOrSeed(KEY, productseed))

  watch(products, (val) => save(KEY, val), { deep: true })

  // ── Helpers ──────────────────────────────────────────────────────────────
  function _nextId() {
    const ids = products.value.map((p) => Number(p.id)).filter(Boolean)
    return String(ids.length > 0 ? Math.max(...ids) + 1 : 1)
  }

  function _guardOwner() {
    const auth = useAuthStore()
    if (auth.role !== 'owner_cabang')
      return { ok: false, message: 'Hanya Kepala Cabang yang dapat mengubah data produk.' }
    return null
  }

  // ── Actions ──────────────────────────────────────────────────────────────
  function add(data) {
    const err = _guardOwner()
    if (err) return err
    products.value.push({
      id:        _nextId(),
      name:      data.name.trim(),
      type:      data.type,
      price:     Number(data.price),
      stock:     Number(data.stock),
      min_stock: Number(data.min_stock)
    })
    return { ok: true }
  }

  function update(id, data) {
    const err = _guardOwner()
    if (err) return err
    const idx = products.value.findIndex((p) => p.id === id)
    if (idx === -1) return { ok: false, message: 'Produk tidak ditemukan.' }
    Object.assign(products.value[idx], {
      name:      data.name.trim(),
      type:      data.type,
      price:     Number(data.price),
      stock:     Number(data.stock),
      min_stock: Number(data.min_stock)
    })
    return { ok: true }
  }

  /**
   * Tambah (delta > 0) atau kurangi (delta < 0) stok.
   * Tidak memerlukan guard role karena dipanggil juga oleh transactions.add()
   * yang bisa diakses owner_cabang dan karyawan.
   * Stok tidak boleh turun di bawah 0.
   */
  function adjustStock(id, delta) {
    const idx = products.value.findIndex((p) => p.id === id)
    if (idx === -1) return
    const next = products.value[idx].stock + Number(delta)
    products.value[idx].stock = Math.max(0, next)
  }

  function getById(id) {
    return products.value.find((p) => p.id === id) ?? null
  }

  return { products, add, update, adjustStock, getById }
})
