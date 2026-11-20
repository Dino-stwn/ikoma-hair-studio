import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import { loadOrSeed, save } from '@/utils/storage'
import { buatKodeTransaksi, todayISO } from '@/utils/format'
import transactionseed from '@/seed/transactions.json'
import { useProductsStore } from '@/stores/products'
import { useAuthStore }     from '@/stores/auth'

const KEY = 'ikoma_transactions'

export const useTransactionsStore = defineStore('transactions', () => {
  const transactions = ref(loadOrSeed(KEY, transactionseed))

  watch(transactions, (val) => save(KEY, val), { deep: true })

  // ── Actions ──────────────────────────────────────────────────────────────

  /** Catat transaksi baru. Validasi stok → hitung total → kurangi stok. */
  function add(payload) {
    const productsStore = useProductsStore()

    // 1. Validasi stok semua item produk
    for (const item of payload.items) {
      if (item.item_type !== 'product') continue
      const product = productsStore.getById(item.product_id)
      if (!product) return { ok: false, message: 'Produk tidak ditemukan.' }
      if (product.stock === 0)
        return { ok: false, message: `Stok produk "${product.name}" sudah habis.` }
      if (item.qty > product.stock)
        return { ok: false, message: `Stok produk tidak mencukupi: "${product.name}" (tersisa ${product.stock}).` }
    }

    // 2. Buat transaksi
    const trx_date = todayISO()
    const code     = buatKodeTransaksi(trx_date, transactions.value)
    const total    = payload.items.reduce((s, i) => s + i.subtotal, 0)

    const trx = {
      id:             String(Date.now()),
      code,
      user_id:        payload.user_id,
      trx_date,
      payment_method: payload.payment_method,
      total,
      note:           payload.note ?? '',
      items: payload.items.map((i) => ({
        item_type:  i.item_type,
        service_id: i.service_id ?? null,
        product_id: i.product_id ?? null,
        qty:        i.qty,
        unit_price: i.unit_price,
        subtotal:   i.subtotal,
        note:       i.note ?? ''
      }))
    }

    // 3. Kurangi stok produk
    for (const item of payload.items) {
      if (item.item_type === 'product') productsStore.adjustStock(item.product_id, -item.qty)
    }

    transactions.value.push(trx)
    return { ok: true, code }
  }

  /**
   * Ubah transaksi — hanya payment_method dan note.
   * Ditolak jika pemanggil bukan owner_cabang.
   */
  function update(id, data) {
    const auth = useAuthStore()
    if (auth.role !== 'owner_cabang')
      return { ok: false, message: 'Hanya Kepala Cabang yang dapat mengubah transaksi.' }

    const idx = transactions.value.findIndex((t) => t.id === id)
    if (idx === -1) return { ok: false, message: 'Transaksi tidak ditemukan.' }

    transactions.value[idx].payment_method = data.payment_method
    transactions.value[idx].note           = data.note ?? ''
    return { ok: true }
  }

  /**
   * Hapus transaksi dan kembalikan stok produk terkait.
   * Ditolak jika pemanggil bukan owner_cabang.
   */
  function remove(id) {
    const auth = useAuthStore()
    if (auth.role !== 'owner_cabang')
      return { ok: false, message: 'Hanya Kepala Cabang yang dapat menghapus transaksi.' }

    const trx = transactions.value.find((t) => t.id === id)
    if (!trx) return { ok: false, message: 'Transaksi tidak ditemukan.' }

    // Kembalikan stok produk
    const productsStore = useProductsStore()
    for (const item of trx.items) {
      if (item.item_type === 'product' && item.product_id) {
        productsStore.adjustStock(item.product_id, item.qty)
      }
    }

    transactions.value = transactions.value.filter((t) => t.id !== id)
    return { ok: true }
  }

  function getById(id) {
    return transactions.value.find((t) => t.id === id) ?? null
  }

  return { transactions, add, update, remove, getById }
})
