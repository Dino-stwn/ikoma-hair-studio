<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import BaseInput   from '@/components/common/BaseInput.vue'
import BaseButton  from '@/components/common/BaseButton.vue'
import AlertMessage from '@/components/common/AlertMessage.vue'

const router = useRouter()
const auth   = useAuthStore()

const username  = ref('')
const password  = ref('')
const loading   = ref(false)
const alertMsg  = ref('')

// Error per-field untuk validasi kosong
const errors = ref({ username: '', password: '' })

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
  <div class="login-form-card card">
    <!-- Brand -->
    <div class="login-brand">
      <p class="brand-logo">I KOMA</p>
      <p class="brand-tagline">Hair Studio &mdash; Cabang 2</p>
    </div>

    <!-- Alert error -->
    <AlertMessage
      type="error"
      :message="alertMsg"
      @close="alertMsg = ''"
    />

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

      <BaseButton
        type="submit"
        label="Masuk"
        variant="primary"
        :disabled="loading"
        class="btn-full"
      >
        {{ loading ? 'Memproses…' : 'Masuk' }}
      </BaseButton>
    </form>

    <!-- Petunjuk akun demo -->
    <details class="demo-info">
      <summary>Akun demo</summary>
      <ul>
        <li><code>owner.utama</code> / <code>demo123</code> — Pemilik Utama</li>
        <li><code>owner.cabang</code> / <code>demo123</code> — Kepala Cabang</li>
        <li><code>karyawan1</code> / <code>demo123</code> — Karyawan</li>
      </ul>
    </details>
  </div>
</template>

<style scoped>
.login-form-card {
  width: 100%;
  max-width: 420px;
  padding: 40px;
}

/* Brand */
.login-brand {
  text-align: center;
  margin-bottom: 28px;
}

.brand-logo {
  font-family: var(--font-heading);
  font-size: 38px;
  font-weight: 700;
  color: var(--color-primary);
  letter-spacing: 5px;
  line-height: 1;
}

.brand-tagline {
  font-size: var(--text-label);
  color: #9CA3AF;
  margin-top: 6px;
}

/* Form spacing */
.mb-field { margin-bottom: 16px; }

.btn-full {
  width: 100%;
  justify-content: center;
  margin-top: 4px;
}

/* Demo info */
.demo-info {
  margin-top: 24px;
  font-size: var(--text-label);
  color: #9CA3AF;
  border-top: 1px solid #F3F4F6;
  padding-top: 16px;
}

.demo-info summary {
  cursor: pointer;
  font-weight: 500;
  margin-bottom: 8px;
  color: #6B7280;
}

.demo-info ul {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.demo-info code {
  background: #F3F4F6;
  padding: 1px 5px;
  border-radius: 3px;
  font-size: 11px;
}
</style>
