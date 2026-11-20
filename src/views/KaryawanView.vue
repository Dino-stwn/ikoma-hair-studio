<script setup>
import { ref, computed } from 'vue'
import MainLayout        from '@/layouts/MainLayout.vue'
import EmployeeTable     from '@/components/features/employees/EmployeeTable.vue'
import EmployeeForm      from '@/components/features/employees/EmployeeForm.vue'
import ConfirmDialog     from '@/components/common/ConfirmDialog.vue'
import AlertMessage      from '@/components/common/AlertMessage.vue'
import BaseButton        from '@/components/common/BaseButton.vue'
import { useAlert }      from '@/composables/useAlert'
import { useUsersStore } from '@/stores/users'
import { useAuthStore  } from '@/stores/auth'

const store = useUsersStore()
const auth  = useAuthStore()
const { alertMsg, alertType, showAlert, clearAlert } = useAlert()

const currentUserId = computed(() => auth.currentUser?.id ?? '')

// ── Form tambah ────────────────────────────────────────────────────────────
const showForm = ref(false)
function onSaved() { showAlert('Karyawan berhasil ditambahkan.') }

// ── Toggle aktif / nonaktif ────────────────────────────────────────────────
const showConfirm  = ref(false)
const toggleTarget = ref(null)

function openToggle(user) {
  if (user.id === currentUserId.value) {
    showAlert('Anda tidak dapat mengubah status akun sendiri.', 'error')
    return
  }
  toggleTarget.value = user; showConfirm.value = true
}

function confirmToggle() {
  const user   = toggleTarget.value
  const result = store.update(user.id, { is_active: !user.is_active })
  const label  = !user.is_active ? 'diaktifkan' : 'dinonaktifkan'
  showConfirm.value = false; toggleTarget.value = null
  showAlert(result?.ok === false ? result.message : `Akun ${user.name} berhasil ${label}.`, result?.ok === false ? 'error' : 'success')
}

function cancelToggle() { showConfirm.value = false; toggleTarget.value = null }

const confirmMessage = computed(() => {
  if (!toggleTarget.value) return ''
  const action = toggleTarget.value.is_active ? 'menonaktifkan' : 'mengaktifkan'
  return `Apakah Anda yakin ingin ${action} akun "${toggleTarget.value.name}"?`
})
</script>

<template>
  <MainLayout>
    <div class="page-header">
      <div>
        <h1>Manajemen Karyawan</h1>
        <p class="page-sub">Kelola akun pengguna barbershop.</p>
      </div>
      <BaseButton label="+ Tambah Karyawan" variant="primary" @click="showForm = true" />
    </div>

    <AlertMessage :type="alertType" :message="alertMsg" @close="clearAlert" />

    <div class="card">
      <EmployeeTable :rows="store.users" :current-user-id="currentUserId" @toggle="openToggle" />
    </div>

    <EmployeeForm :show="showForm" @close="showForm = false" @saved="onSaved" />

    <ConfirmDialog
      :show="showConfirm"
      :message="confirmMessage"
      @confirm="confirmToggle"
      @cancel="cancelToggle"
    />
  </MainLayout>
</template>

<style scoped>
.page-header {
  display: flex; align-items: flex-start; justify-content: space-between;
  gap: 16px; margin-bottom: 16px; flex-wrap: wrap;
}
.page-sub { color: #6B7280; margin-top: 4px; font-size: var(--text-body); }
</style>
