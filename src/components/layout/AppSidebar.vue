<script setup>
import { computed } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import BaseIcon from '@/components/common/BaseIcon.vue'

const route = useRoute()
const auth  = useAuthStore()

const userRole = computed(() => auth.role)

const allMenuItems = [
  { to: '/', icon: 'dashboard', label: 'Dashboard', roles: ['owner_utama', 'owner_cabang', 'karyawan'], exact: true },
  { to: '/transaksi/baru', icon: 'plus', label: 'Transaksi Baru', roles: ['owner_cabang', 'karyawan'] },
  { to: '/riwayat', icon: 'history', label: 'Riwayat', roles: ['owner_utama', 'owner_cabang', 'karyawan'] },
  { to: '/layanan', icon: 'scissors', label: 'Layanan', roles: ['owner_cabang'] },
  { to: '/produk', icon: 'box', label: 'Produk', roles: ['owner_cabang'] },
  { to: '/karyawan', icon: 'user', label: 'Karyawan', roles: ['owner_cabang'] },
  { to: '/gaji', icon: 'payroll', label: 'Penggajian', roles: ['owner_utama', 'owner_cabang', 'karyawan'] },
  { to: '/laporan', icon: 'chart', label: 'Laporan', roles: ['owner_utama', 'owner_cabang'] }
]

const visibleMenu = computed(() => allMenuItems.filter((item) => item.roles.includes(userRole.value)))

function isActive(item) {
  if (item.exact) return route.path === item.to
  return route.path.startsWith(item.to)
}
</script>

<template>
  <aside class="sidebar">
    <div class="sidebar__brand">
      <span class="brand-name">I KOMA</span>
      <span class="brand-sub">Hair Studio</span>
    </div>

    <nav class="sidebar__nav" aria-label="Menu utama">
      <RouterLink
        v-for="item in visibleMenu"
        :key="item.to"
        :to="item.to"
        :class="['nav-item', { 'nav-item--active': isActive(item) }]"
        :aria-current="isActive(item) ? 'page' : undefined"
      >
        <span class="nav-item__icon" aria-hidden="true"><BaseIcon :name="item.icon" :size="18" /></span>
        <span class="nav-item__label">{{ item.label }}</span>
      </RouterLink>
    </nav>

    <div class="sidebar__footer">
      <span class="sidebar__version">Cabang ke-2</span>
    </div>
  </aside>
</template>

<style scoped>
.sidebar { height: 100%; background-color: var(--color-secondary); color: #fff; display: flex; flex-direction: column; overflow-y: auto; }
.sidebar__brand { padding: 24px 18px 20px; border-bottom: 1px solid rgba(255,255,255,0.07); display: flex; flex-direction: column; gap: 2px; flex-shrink: 0; }
.brand-name { font-family: var(--font-heading); font-size: 20px; font-weight: 700; color: var(--color-primary); letter-spacing: 5px; }
.brand-sub { font-size: 11px; color: rgba(255,255,255,0.45); letter-spacing: 0.5px; margin-top: 2px; }
.sidebar__nav { flex: 1; padding: 14px 10px; display: flex; flex-direction: column; gap: 4px; }
.nav-item {
  display: flex; align-items: center; gap: 12px; padding: 11px 14px;
  border-radius: var(--radius-btn); color: rgba(255,255,255,0.7); text-decoration: none;
  font-size: var(--text-body); font-weight: 500;
  transition: background var(--transition-fast), color var(--transition-fast), transform var(--transition-fast);
}
.nav-item:hover { background-color: rgba(255,255,255,0.08); color: #fff; transform: translateX(2px); }
.nav-item--active { background-color: var(--color-primary-tint); color: var(--color-primary); font-weight: 600; }
.nav-item--active:hover { background-color: rgba(201,162,39,0.20); color: var(--color-primary); }
.nav-item__icon { display: flex; align-items: center; justify-content: center; width: 20px; flex-shrink: 0; }
.nav-item__label { flex: 1; }
.sidebar__footer { padding: 14px 18px; border-top: 1px solid rgba(255,255,255,0.06); flex-shrink: 0; }
.sidebar__version { font-size: 11px; color: rgba(255,255,255,0.3); letter-spacing: 0.5px; }
</style>
