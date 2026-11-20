<script setup>
import { computed } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const auth  = useAuthStore()

const userRole = computed(() => auth.role)

/** Semua item menu dengan batasan role */
const allMenuItems = [
  {
    to: '/',
    icon: '🏠',
    label: 'Dashboard',
    roles: ['owner_utama', 'owner_cabang', 'karyawan'],
    exact: true
  },
  {
    to: '/transaksi/baru',
    icon: '➕',
    label: 'Transaksi Baru',
    roles: ['owner_cabang', 'karyawan']
  },
  {
    to: '/riwayat',
    icon: '📋',
    label: 'Riwayat',
    roles: ['owner_utama', 'owner_cabang', 'karyawan']
  },
  {
    to: '/layanan',
    icon: '✂️',
    label: 'Layanan',
    roles: ['owner_cabang']
  },
  {
    to: '/produk',
    icon: '📦',
    label: 'Produk',
    roles: ['owner_cabang']
  },
  {
    to: '/karyawan',
    icon: '👤',
    label: 'Karyawan',
    roles: ['owner_cabang']
  },
  {
    to: '/gaji',
    icon: '💰',
    label: 'Penggajian',
    roles: ['owner_utama', 'owner_cabang', 'karyawan']
  },
  {
    to: '/laporan',
    icon: '📊',
    label: 'Laporan',
    roles: ['owner_utama', 'owner_cabang']
  }
]

/** Hanya tampilkan menu yang boleh diakses role aktif */
const visibleMenu = computed(() =>
  allMenuItems.filter((item) => item.roles.includes(userRole.value))
)

/** Cek aktif: Dashboard (/) harus exact, sisanya prefix */
function isActive(item) {
  if (item.exact) return route.path === item.to
  return route.path.startsWith(item.to)
}
</script>

<template>
  <aside class="sidebar">
    <!-- Brand -->
    <div class="sidebar__brand">
      <span class="brand-name">I KOMA</span>
      <span class="brand-sub">Hair Studio</span>
    </div>

    <!-- Navigasi -->
    <nav class="sidebar__nav" aria-label="Menu utama">
      <RouterLink
        v-for="item in visibleMenu"
        :key="item.to"
        :to="item.to"
        :class="['nav-item', { 'nav-item--active': isActive(item) }]"
        :aria-current="isActive(item) ? 'page' : undefined"
      >
        <span class="nav-item__icon" aria-hidden="true">{{ item.icon }}</span>
        <span class="nav-item__label">{{ item.label }}</span>
      </RouterLink>
    </nav>
  </aside>
</template>

<style scoped>
.sidebar {
  height: 100%;
  background-color: var(--color-secondary);
  color: #ffffff;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
}

/* Brand */
.sidebar__brand {
  padding: 24px 20px 18px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex-shrink: 0;
}

.brand-name {
  font-family: var(--font-heading);
  font-size: 22px;
  font-weight: 700;
  color: var(--color-primary);
  letter-spacing: 4px;
}

.brand-sub {
  font-size: var(--text-label);
  color: #9CA3AF;
}

/* Nav */
.sidebar__nav {
  flex: 1;
  padding: 14px 10px;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 8px;
  color: #D1D5DB;
  text-decoration: none;
  font-size: var(--text-body);
  font-weight: 500;
  transition: background 0.15s, color 0.15s;
}

.nav-item:hover {
  background-color: rgba(255, 255, 255, 0.07);
  color: #ffffff;
}

.nav-item--active {
  background-color: rgba(201, 162, 39, 0.18);
  color: var(--color-primary);
}

.nav-item__icon {
  font-size: 15px;
  width: 20px;
  text-align: center;
  flex-shrink: 0;
}

.nav-item__label { flex: 1; }
</style>
