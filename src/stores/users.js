import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import { loadOrSeed, save } from '@/utils/storage'
import { useAuthStore } from '@/stores/auth'
import userseed from '@/seed/users.json'

const KEY = 'ikoma_users'

export const useUsersStore = defineStore('users', () => {
  const users = ref(loadOrSeed(KEY, userseed))

  watch(users, (val) => save(KEY, val), { deep: true })

  // ── Helpers ───────────────────────────────────────────────────────────────
  function _nextId() {
    const ids = users.value.map((u) => Number(u.id)).filter(Boolean)
    return String(ids.length > 0 ? Math.max(...ids) + 1 : 1)
  }

  function _guardOwner() {
    const auth = useAuthStore()
    if (auth.role !== 'owner_cabang')
      return { ok: false, message: 'Hanya Kepala Cabang yang dapat mengubah data karyawan.' }
    return null
  }

  /**
   * Cek apakah username sudah dipakai (case-insensitive).
   * @param {string} username
   * @param {string|null} excludeId - kecualikan user yang sedang diedit
   */
  function isUsernameTaken(username, excludeId = null) {
    const norm = username.trim().toLowerCase()
    return users.value.some(
      (u) => u.username.toLowerCase() === norm && u.id !== excludeId
    )
  }

  // ── Actions ───────────────────────────────────────────────────────────────
  function add(data) {
    const err = _guardOwner()
    if (err) return err
    users.value.push({
      id:        _nextId(),
      name:      data.name.trim(),
      username:  data.username.trim(),
      password:  data.password,
      role:      data.role ?? 'karyawan',
      is_active: true
    })
    return { ok: true }
  }

  function update(id, data) {
    const err = _guardOwner()
    if (err) return err
    const idx = users.value.findIndex((u) => u.id === id)
    if (idx === -1) return { ok: false, message: 'Pengguna tidak ditemukan.' }
    Object.assign(users.value[idx], data)
    return { ok: true }
  }

  function remove(id) {
    const err = _guardOwner()
    if (err) return err
    users.value = users.value.filter((u) => u.id !== id)
    return { ok: true }
  }

  function getById(id) {
    return users.value.find((u) => u.id === id) ?? null
  }

  function findByCredentials(username, password) {
    return (
      users.value.find(
        (u) => u.username === username && u.password === password && u.is_active
      ) ?? null
    )
  }

  return { users, add, update, remove, getById, findByCredentials, isUsernameTaken }
})
