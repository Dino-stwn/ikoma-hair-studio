<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import BaseInput   from '@/components/common/BaseInput.vue'
import BaseButton  from '@/components/common/BaseButton.vue'
import AlertMessage from '@/components/common/AlertMessage.vue'

const router = useRouter()
const auth   = useAuthStore()

const username = ref('')
const password = ref('')
const loading  = ref(false)
const alertMsg = ref('')
const errors   = ref({ username: '', password: '' })

function validate() {
  errors.value.username = username.value.trim() ? '' : 'Username wajib diisi.'
  errors.value.password = password.value       ? '' : 'Password wajib diisi.'
  return !errors.value.username && !errors.value.password
}

async function handleSubmit() {
  alertMsg.value = ''
  if (!validate()) return
  loading.value = true
  const result = auth.login(username.value.trim(), password.value)
  loading.value = false
  if (!result.ok) {
    alertMsg.value = result.message
    password.value = ''
    return
  }
  router.push({ name: 'Dashboard' })
}
</script>

<template>
  <div class="login-card">
    <div class="login-brand">
      <p class="brand-logo">I KOMA</p>
      <p class="brand-name">Hair Studio</p>
      <p class="brand-tagline">Cabang ke-2 &mdash; Sistem Manajemen</p>
    </div>

    <AlertMessage type="error" :message="alertMsg" @close="alertMsg = ''" />

    <form novalidate @submit.prevent="handleSubmit">
      <BaseInput
        v-model="username"
        label="Username"
        placeholder="Masukkan username"
        autocomplete="username"
        :error="errors.username"
        class="mb-field"
      />
      <BaseInput
        v-model="password"
        label="Password"
        type="password"
        placeholder="Masukkan password"
        autocomplete="current-password"
        :error="errors.password"
        class="mb-field"
      />
      <BaseButton type="submit" label="Masuk" variant="primary" :disabled="loading" class="btn-full">
        {{ loading ? 'Memproses…' : 'Masuk' }}
      </BaseButton>
    </form>
  </div>
</template>

<style scoped>
.login-card {
  width: 100%; max-width: 420px;
  background: var(--color-surface); border-radius: var(--radius-modal);
  padding: 44px 40px; box-shadow: var(--shadow-lg);
}
.login-brand { text-align: center; margin-bottom: 30px; }
.brand-logo {
  font-family: var(--font-heading); font-size: 36px;
  font-weight: 700; color: var(--color-primary); letter-spacing: 6px; line-height: 1;
}
.brand-name { font-family: var(--font-heading); font-size: 15px; font-weight: 600; color: var(--color-secondary); margin-top: 4px; letter-spacing: 1px; }
.brand-tagline { font-size: var(--text-label); color: #9CA3AF; margin-top: 6px; }
.mb-field { margin-bottom: 18px; }
.btn-full { width: 100%; justify-content: center; margin-top: 6px; }
.demo-info { margin-top: 24px; font-size: var(--text-label); color: #9CA3AF; border-top: 1px solid #F3F4F6; padding-top: 16px; }
.demo-info summary { cursor: pointer; font-weight: 500; margin-bottom: 8px; color: #6B7280; user-select: none; }
.demo-info ul { list-style: none; display: flex; flex-direction: column; gap: 5px; margin-top: 8px; }
.demo-info li { font-size: 11px; }
.demo-info code { background: #F3F4F6; padding: 1px 6px; border-radius: 4px; font-size: 11px; font-family: monospace; color: var(--color-secondary); }
@media (max-width: 480px) { .login-card { padding: 32px 24px; } }
</style>
