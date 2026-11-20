<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import BaseBadge   from '@/components/common/BaseBadge.vue'
import BaseButton  from '@/components/common/BaseButton.vue'

const router = useRouter()
const auth   = useAuthStore()

const user = computed(() => auth.currentUser)

const roleConfig = {
  owner_utama:  { label: 'Pemilik Utama',  variant: 'success'  },
  owner_cabang: { label: 'Kepala Cabang',  variant: 'warning'  },
  karyawan:     { label: 'Karyawan',       variant: 'neutral'  }
}

const roleBadge = computed(() => {
  const cfg = roleConfig[user.value?.role]
  return cfg ?? { label: user.value?.role ?? '-', variant: 'neutral' }
})

function handleLogout() {
  auth.logout()
  router.push({ name: 'Login' })
}
</script>

<template>
  <header class="topbar">
    <!-- Kiri: slot (hamburger di mobile) + judul halaman -->
    <div class="topbar__left">
      <slot />
    </div>

    <!-- Kanan: info pengguna + tombol keluar -->
    <div class="topbar__right">
      <div class="user-info">
        <span class="user-info__name">{{ user?.name }}</span>
        <BaseBadge :text="roleBadge.label" :variant="roleBadge.variant" />
      </div>
      <BaseButton label="Keluar" variant="ghost" @click="handleLogout" />
    </div>
  </header>
</template>

<style scoped>
.topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  height: 64px;
  background-color: var(--color-surface);
  border-bottom: 1px solid #F3F4F6;
  box-shadow: var(--shadow-sm);
  gap: 12px;
}

.topbar__left {
  flex: 1;
  display: flex;
  align-items: center;
}

.topbar__right {
  display: flex;
  align-items: center;
  gap: 14px;
}

.user-info {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 3px;
}

.user-info__name {
  font-size: var(--text-body);
  font-weight: 600;
  color: var(--color-text);
  line-height: 1;
  white-space: nowrap;
}

@media (max-width: 600px) {
  .topbar {
    padding: 0 14px;
    height: 58px;
    gap: 8px;
  }
  .topbar__right {
    gap: 10px;
  }
  .user-info__name {
    font-size: 12px;
  }
}
</style>
