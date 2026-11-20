import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import { loadOrSeed, save } from '@/utils/storage'
import { useAuthStore } from '@/stores/auth'
import serviceseed from '@/seed/services.json'

const KEY = 'ikoma_services'

export const useServicesStore = defineStore('services', () => {
  const services = ref(loadOrSeed(KEY, serviceseed))

  watch(services, (val) => save(KEY, val), { deep: true })

  // ── Getters ──────────────────────────────────────────────────────────────
  const activeServices = computed(() =>
    services.value.filter((s) => s.is_active)
  )

  // ── Helpers ───────────────────────────────────────────────────────────────
  function _nextId() {
    const ids = services.value.map((s) => Number(s.id)).filter(Boolean)
    return String(ids.length > 0 ? Math.max(...ids) + 1 : 1)
  }

  function _guardOwner() {
    const auth = useAuthStore()
    if (auth.role !== 'owner_cabang')
      return { ok: false, message: 'Hanya Kepala Cabang yang dapat mengubah data layanan.' }
    return null
  }

  // ── Actions ───────────────────────────────────────────────────────────────
  function add(data) {
    const err = _guardOwner()
    if (err) return err
    services.value.push({
      id:        _nextId(),
      name:      data.name.trim(),
      price:     Number(data.price),
      is_active: true
    })
    return { ok: true }
  }

  function update(id, data) {
    const err = _guardOwner()
    if (err) return err
    const idx = services.value.findIndex((s) => s.id === id)
    if (idx === -1) return { ok: false, message: 'Layanan tidak ditemukan.' }
    Object.assign(services.value[idx], {
      name:  data.name.trim(),
      price: Number(data.price)
    })
    return { ok: true }
  }

  /**
   * "Hapus" = nonaktifkan (soft-delete), bukan benar-benar menghapus baris.
   * Data tetap ada di localStorage agar riwayat transaksi tetap konsisten.
   */
  function remove(id) {
    const err = _guardOwner()
    if (err) return err
    const idx = services.value.findIndex((s) => s.id === id)
    if (idx === -1) return { ok: false, message: 'Layanan tidak ditemukan.' }
    services.value[idx].is_active = false
    return { ok: true }
  }

  function getById(id) {
    return services.value.find((s) => s.id === id) ?? null
  }

  function isNameTaken(name, excludeId = null) {
    const normalized = name.trim().toLowerCase()
    return services.value.some(
      (s) =>
        s.is_active &&
        s.name.trim().toLowerCase() === normalized &&
        s.id !== excludeId
    )
  }

  return { services, activeServices, add, update, remove, getById, isNameTaken }
})
