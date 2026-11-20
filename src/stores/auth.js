import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { save } from '@/utils/storage'
import { useUsersStore } from '@/stores/users'

const SESSION_KEY = 'ikoma_session'

/** Muat sesi dari localStorage tanpa loadOrSeed (sesi bisa null). */
function readSession() {
  try {
    const raw = localStorage.getItem(SESSION_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    return parsed && typeof parsed === 'object' ? parsed : null
  } catch {
    return null
  }
}

export const useAuthStore = defineStore('auth', () => {
  const session = ref(readSession()) // { id, name, username, role } | null

  // ─── Getters ──────────────────────────────────────────────────────────────
  const isLoggedIn = computed(() => session.value !== null)
  const role       = computed(() => session.value?.role ?? null)
  const currentUser = computed(() => session.value)

  // ─── Actions ──────────────────────────────────────────────────────────────

  /**
   * Coba login dengan username + password.
   * @returns {{ ok: boolean, message: string }}
   */
  function login(username, password) {
    if (!username || !password) {
      return { ok: false, message: 'Username dan password wajib diisi.' }
    }

    const usersStore = useUsersStore()
    const user = usersStore.findByCredentials(username.trim(), password)

    if (!user) {
      return { ok: false, message: 'Username atau password salah.' }
    }
    if (!user.is_active) {
      return { ok: false, message: 'Akun tidak aktif. Hubungi administrator.' }
    }

    const sessionData = {
      id:       user.id,
      name:     user.name,
      username: user.username,
      role:     user.role
    }
    session.value = sessionData
    save(SESSION_KEY, sessionData)

    return { ok: true, message: '' }
  }

  function logout() {
    session.value = null
    localStorage.removeItem(SESSION_KEY)
  }

  return { session, currentUser, isLoggedIn, role, login, logout }
})
