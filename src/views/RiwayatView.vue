<script setup>
import { ref, computed } from 'vue'
import MainLayout        from '@/layouts/MainLayout.vue'
import FilterBar         from '@/components/features/transactions/FilterBar.vue'
import TransactionTable  from '@/components/features/transactions/TransactionTable.vue'
import EditTransactionModal from '@/components/features/transactions/EditTransactionModal.vue'
import ConfirmDialog     from '@/components/common/ConfirmDialog.vue'
import AlertMessage      from '@/components/common/AlertMessage.vue'
import { formatRupiah }  from '@/utils/format'
import { useAlert }      from '@/composables/useAlert'
import { useAuthStore }         from '@/stores/auth'
import { useTransactionsStore } from '@/stores/transactions'

const auth     = useAuthStore()
const trxStore = useTransactionsStore()

const { alertMsg, alertType, showAlert, clearAlert } = useAlert()

const isOwnerCabang = computed(() => auth.role === 'owner_cabang')

// ── Filter ─────────────────────────────────────────────────────────────────
const filters = ref({ dateFrom: '', dateTo: '', paymentMethod: '', userId: '' })

function onFilterChange(f) { filters.value = { ...f } }

const filteredRaw = computed(() =>
  trxStore.transactions
    .filter((t) => {
      if (filters.value.dateFrom && t.trx_date < filters.value.dateFrom) return false
      if (filters.value.dateTo   && t.trx_date > filters.value.dateTo)   return false
      if (filters.value.paymentMethod && t.payment_method !== filters.value.paymentMethod) return false
      if (filters.value.userId        && t.user_id        !== filters.value.userId)        return false
      return true
    })
    .sort((a, b) => (b.trx_date > a.trx_date ? 1 : -1))
)

const totalFiltered = computed(() =>
  filteredRaw.value.reduce((s, t) => s + t.total, 0)
)

// ── Edit ───────────────────────────────────────────────────────────────────
const showEdit   = ref(false)
const editTarget = ref(null)

function openEdit(row) { editTarget.value = trxStore.getById(row.id); showEdit.value = true }
function onEditSaved(data) {
  const result = trxStore.update(editTarget.value.id, data)
  showEdit.value = false
  showAlert(result.ok ? 'Transaksi berhasil diperbarui.' : result.message, result.ok ? 'success' : 'error')
}

// ── Hapus ──────────────────────────────────────────────────────────────────
const showConfirm  = ref(false)
const deleteTarget = ref(null)

function openDelete(row)  { deleteTarget.value = row; showConfirm.value = true }
function cancelDelete()   { showConfirm.value = false; deleteTarget.value = null }
function confirmDelete() {
  const result = trxStore.remove(deleteTarget.value.id)
  showConfirm.value = false; deleteTarget.value = null
  showAlert(result.ok ? 'Transaksi dihapus dan stok dikembalikan.' : result.message, result.ok ? 'success' : 'error')
}
</script>

<template>
  <MainLayout>
    <div class="page-header">
      <h1>Riwayat Transaksi</h1>
    </div>

    <AlertMessage :type="alertType" :message="alertMsg" @close="clearAlert" />

    <FilterBar @change="onFilterChange" />

    <div class="card">
      <TransactionTable
        :rows="filteredRaw"
        :show-actions="isOwnerCabang"
        @edit="openEdit"
        @delete="openDelete"
      />
      <div class="summary-row">
        <span class="summary-label">Total ({{ filteredRaw.length }} transaksi)</span>
        <strong class="summary-total">{{ formatRupiah(totalFiltered) }}</strong>
      </div>
    </div>

    <EditTransactionModal
      :show="showEdit"
      :transaction="editTarget"
      @close="showEdit = false"
      @saved="onEditSaved"
    />

    <ConfirmDialog
      :show="showConfirm"
      :message="`Hapus transaksi &quot;${deleteTarget?.code}&quot;? Stok produk akan dikembalikan.`"
      @confirm="confirmDelete"
      @cancel="cancelDelete"
    />
  </MainLayout>
</template>

<style scoped>
.page-header { margin-bottom: 16px; }
.summary-row {
  display: flex; justify-content: space-between; align-items: center;
  padding: 14px 0 2px; margin-top: 8px; border-top: 2px solid #E5E7EB;
}
.summary-label { font-size: var(--text-body); color: #6B7280; }
.summary-total { font-family: var(--font-heading); font-size: var(--text-subheading); color: var(--color-secondary); }
</style>
