<script setup>
import { ref, computed } from 'vue'
import MainLayout     from '@/layouts/MainLayout.vue'
import ServiceTable   from '@/components/features/services/ServiceTable.vue'
import ServiceForm    from '@/components/features/services/ServiceForm.vue'
import ConfirmDialog  from '@/components/common/ConfirmDialog.vue'
import AlertMessage   from '@/components/common/AlertMessage.vue'
import BaseButton     from '@/components/common/BaseButton.vue'
import { useAlert }   from '@/composables/useAlert'
import { useServicesStore } from '@/stores/services'

const store = useServicesStore()
const { alertMsg, alertType, showAlert, clearAlert } = useAlert()

const tableRows = computed(() => store.activeServices)

// ── Form ───────────────────────────────────────────────────────────────────
const showForm   = ref(false)
const editTarget = ref(null)

function openAdd()         { editTarget.value = null; showForm.value = true }
function openEdit(service) { editTarget.value = { ...service }; showForm.value = true }
function closeForm()       { showForm.value = false; editTarget.value = null }
function onSaved(mode)     { showAlert(`Layanan berhasil ${mode === 'ubah' ? 'diperbarui' : 'ditambahkan'}.`) }

// ── Hapus ──────────────────────────────────────────────────────────────────
const showConfirm  = ref(false)
const deleteTarget = ref(null)

function openDelete(service)  { deleteTarget.value = service; showConfirm.value = true }
function cancelDelete()       { showConfirm.value = false; deleteTarget.value = null }
function confirmDelete() {
  const result = store.remove(deleteTarget.value.id)
  showConfirm.value = false; deleteTarget.value = null
  showAlert(result?.ok === false ? result.message : 'Layanan berhasil dinonaktifkan.', result?.ok === false ? 'error' : 'success')
}
</script>

<template>
  <MainLayout>
    <div class="page-header">
      <div>
        <h1>Manajemen Layanan</h1>
        <p class="page-sub">Kelola daftar layanan yang tersedia di barbershop.</p>
      </div>
      <BaseButton label="+ Tambah Layanan" variant="primary" @click="openAdd" />
    </div>

    <AlertMessage :type="alertType" :message="alertMsg" @close="clearAlert" />

    <div class="card mt-card">
      <ServiceTable :rows="tableRows" @edit="openEdit" @delete="openDelete" />
    </div>

    <ServiceForm :show="showForm" :edit-target="editTarget" @close="closeForm" @saved="onSaved" />

    <ConfirmDialog
      :show="showConfirm"
      :message="`Nonaktifkan layanan &quot;${deleteTarget?.name}&quot;? Layanan tidak akan muncul di transaksi baru.`"
      @confirm="confirmDelete"
      @cancel="cancelDelete"
    />
  </MainLayout>
</template>

<style scoped>
.page-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 24px;
  flex-wrap: wrap;
}
.page-sub { color: #6B7280; margin-top: 6px; font-size: var(--text-body); }
.mt-card  { margin-top: 0; }
</style>
