<script setup>
import { ref, watch } from 'vue'
import BaseModal  from '@/components/common/BaseModal.vue'
import BaseInput  from '@/components/common/BaseInput.vue'
import BaseButton from '@/components/common/BaseButton.vue'
import { useUsersStore } from '@/stores/users'

const props = defineProps({
  show: { type: Boolean, default: false }
})
const emit = defineEmits(['close', 'saved'])

const store  = useUsersStore()

const name     = ref('')
const username = ref('')
const password = ref('')
const errors   = ref({ name: '', username: '', password: '', general: '' })

// Reset form setiap modal dibuka
watch(
  () => props.show,
  (val) => {
    if (val) {
      name.value = ''; username.value = ''; password.value = ''
      errors.value = { name: '', username: '', password: '', general: '' }
    }
  }
)

function validate() {
  const e = { name: '', username: '', password: '', general: '' }

  if (!name.value.trim()) e.name = 'Nama wajib diisi.'

  const uname = username.value.trim()
  if (!uname) {
    e.username = 'Username wajib diisi.'
  } else if (store.isUsernameTaken(uname)) {
    e.username = 'Username sudah digunakan.'
  }

  if (!password.value) {
    e.password = 'Password wajib diisi.'
  } else if (password.value.length < 6) {
    e.password = 'Password minimal 6 karakter.'
  }

  errors.value = e
  return !e.name && !e.username && !e.password
}

function handleSubmit() {
  if (!validate()) return
  const result = store.add({
    name: name.value, username: username.value,
    password: password.value, role: 'karyawan'
  })
  if (result && !result.ok) {
    errors.value.general = result.message
    return
  }
  emit('saved')
  emit('close')
}
</script>

<template>
  <BaseModal :show="show" title="Tambah Karyawan" @close="$emit('close')">
    <form id="employee-form" novalidate @submit.prevent="handleSubmit">
      <!-- Role tetap: karyawan -->
      <div class="role-info">
        <span class="label">Role</span>
        <span class="role-val">Karyawan</span>
      </div>

      <p v-if="errors.general" class="err-general">{{ errors.general }}</p>

      <BaseInput v-model="name"     label="Nama Lengkap" placeholder="cth. Andi Saputra"  :error="errors.name"     class="mb-f" />
      <BaseInput v-model="username" label="Username"     placeholder="cth. andi.s"         :error="errors.username" class="mb-f" />
      <BaseInput v-model="password" label="Password"     type="password" placeholder="Minimal 6 karakter" :error="errors.password" class="mb-f" />
    </form>

    <template #footer>
      <BaseButton label="Batal"   variant="secondary" @click="$emit('close')" />
      <BaseButton label="Tambah"  variant="primary"   type="submit" form="employee-form" />
    </template>
  </BaseModal>
</template>

<style scoped>
.mb-f { margin-bottom: 16px; }
.err-general { color: var(--color-danger); font-size: var(--text-label); margin-bottom: 10px; }
.role-info {
  display: flex; align-items: center; gap: 12px;
  padding: 10px 12px; background: #F9FAFB;
  border-radius: 6px; margin-bottom: 16px; border: 1px solid #E5E7EB;
}
.role-val { font-weight: 600; color: var(--color-secondary); font-size: var(--text-body); }
</style>
