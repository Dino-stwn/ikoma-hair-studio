<script setup>
import { useRouter } from 'vue-router'
import BaseButton from '@/components/common/BaseButton.vue'

const router = useRouter()
</script>

<template>
  <div class="forbidden-page">
    <div class="forbidden-card card">
      <p class="forbidden-code">403</p>
      <h1>Akses Ditolak</h1>
      <p class="forbidden-desc">
        Anda tidak memiliki izin untuk mengakses halaman ini.
      </p>
      <div class="forbidden-actions">
        <BaseButton
          label="← Kembali"
          variant="ghost"
          @click="router.go(-1)"
        />
        <BaseButton
          label="Dashboard"
          variant="primary"
          @click="router.push({ name: 'Dashboard' })"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.forbidden-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--color-bg);
  padding: 16px;
}

.forbidden-card {
  text-align: center;
  max-width: 420px;
  width: 100%;
  padding: 56px 44px;
}

.forbidden-code {
  font-family: var(--font-heading);
  font-size: 80px;
  font-weight: 700;
  color: var(--color-danger);
  line-height: 1;
  margin-bottom: 16px;
  opacity: 0.85;
}

.forbidden-desc {
  color: #6B7280;
  margin-top: 10px;
  margin-bottom: 32px;
  line-height: 1.65;
}

.forbidden-actions {
  display: flex;
  gap: 10px;
  justify-content: center;
}
</style>
