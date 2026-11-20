import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const routes = [
  // ── Publik ────────────────────────────────────────────────────────────────
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/LoginView.vue'),
    meta: { requiresGuest: true }
  },
  {
    path: '/forbidden',
    name: 'Forbidden',
    component: () => import('@/views/ForbiddenView.vue')
  },

  // ── Terautentikasi ────────────────────────────────────────────────────────
  {
    path: '/',
    name: 'Dashboard',
    component: () => import('@/views/DashboardView.vue'),
    meta: {
      requiresAuth: true,
      roles: ['owner_utama', 'owner_cabang', 'karyawan']
    }
  },
  {
    path: '/transaksi/baru',
    name: 'TransaksiBaru',
    component: () => import('@/views/TransaksiBaruView.vue'),
    meta: {
      requiresAuth: true,
      roles: ['owner_cabang', 'karyawan']
    }
  },
  {
    path: '/riwayat',
    name: 'Riwayat',
    component: () => import('@/views/RiwayatView.vue'),
    meta: {
      requiresAuth: true,
      roles: ['owner_utama', 'owner_cabang', 'karyawan']
    }
  },
  {
    path: '/layanan',
    name: 'Layanan',
    component: () => import('@/views/LayananView.vue'),
    meta: {
      requiresAuth: true,
      roles: ['owner_cabang']
    }
  },
  {
    path: '/produk',
    name: 'Produk',
    component: () => import('@/views/ProdukView.vue'),
    meta: {
      requiresAuth: true,
      roles: ['owner_cabang']
    }
  },
  {
    path: '/karyawan',
    name: 'Karyawan',
    component: () => import('@/views/KaryawanView.vue'),
    meta: {
      requiresAuth: true,
      roles: ['owner_cabang']
    }
  },
  {
    path: '/gaji',
    name: 'Gaji',
    component: () => import('@/views/GajiView.vue'),
    meta: {
      requiresAuth: true,
      roles: ['owner_utama', 'owner_cabang', 'karyawan']
    }
  },
  {
    path: '/laporan',
    name: 'Laporan',
    component: () => import('@/views/LaporanView.vue'),
    meta: {
      requiresAuth: true,
      roles: ['owner_utama', 'owner_cabang']
    }
  },

  // ── Fallback ──────────────────────────────────────────────────────────────
  { path: '/:pathMatch(.*)*', redirect: '/' }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

router.beforeEach((to, _from, next) => {
  const auth = useAuthStore()

  // Halaman yang hanya boleh diakses tamu
  if (to.meta.requiresGuest && auth.isLoggedIn) {
    return next({ name: 'Dashboard' })
  }

  // Halaman yang butuh autentikasi
  if (to.meta.requiresAuth && !auth.isLoggedIn) {
    return next({ name: 'Login' })
  }

  // Role tidak sesuai
  if (to.meta.roles && auth.isLoggedIn) {
    if (!to.meta.roles.includes(auth.role)) {
      return next({ name: 'Forbidden' })
    }
  }

  next()
})

export default router
