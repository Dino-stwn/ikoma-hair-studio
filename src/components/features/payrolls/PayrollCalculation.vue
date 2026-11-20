<script setup>
import { ref, computed } from 'vue'
import BaseBadge      from '@/components/common/BaseBadge.vue'
import AlertMessage   from '@/components/common/AlertMessage.vue'
import PayrollSavePanel from '@/components/features/payrolls/PayrollSavePanel.vue'
import { useTransactionsStore } from '@/stores/transactions'
import { useUsersStore }        from '@/stores/users'
import { usePayrollsStore }     from '@/stores/payrolls'
import { useAuthStore }         from '@/stores/auth'
import { useAlert }             from '@/composables/useAlert'
import { formatRupiah, formatTanggalPendek } from '@/utils/format'

const props = defineProps({
  weekStart: { type: String, default: '' },
  weekEnd:   { type: String, default: '' }
})

const trxStore     = useTransactionsStore()
const usersStore   = useUsersStore()
const payrollStore = usePayrollsStore()
const auth         = useAuthStore()
const { alertMsg, alertType, showAlert, clearAlert } = useAlert()

const isOwner = computed(() => auth.role === 'owner_cabang')

const weeklyTrx = computed(() =>
  !props.weekStart ? [] : trxStore.transactions.filter((t) => t.trx_date >= props.weekStart && t.trx_date <= props.weekEnd)
)
const totalRevenue = computed(() => weeklyTrx.value.reduce((s, t) => s + t.total, 0))
const eligibleEmployees = computed(() =>
  usersStore.users.filter((u) => u.is_active && ['owner_cabang', 'karyawan'].includes(u.role))
)
const empCount  = computed(() => eligibleEmployees.value.length)
const alreadySaved = computed(() => props.weekStart ? payrollStore.isWeekSaved(props.weekStart) : false)

function getNet(deduction) { return Math.max(0, totalRevenue.value - deduction) }
function getPerPerson(deduction) {
  const net = getNet(deduction)
  return empCount.value > 0 ? Math.floor(net / empCount.value) : 0
}

const previewNet       = computed(() => totalRevenue.value)
const previewPerPerson = computed(() => empCount.value > 0 ? Math.floor(previewNet.value / empCount.value) : 0)
const previewRemainder = computed(() => previewNet.value - previewPerPerson.value * empCount.value)

const savePanelRef = ref(null)

function handleSave(deduction) {
  const net       = getNet(deduction)
  const perPerson = getPerPerson(deduction)
  const result = payrollStore.add({
    week_start: props.weekStart, week_end: props.weekEnd, total_revenue: totalRevenue.value,
    deduction, net_total: net, details: eligibleEmployees.value.map((u) => ({ user_id: u.id, amount: perPerson }))
  })
  showAlert(result.message || 'Rekap gaji berhasil disimpan.', result.ok ? 'success' : 'error')
}
</script>

<template>
  <div v-if="weekStart" class="calc-panel card">
    <h2 class="calc-title">
      Kalkulasi {{ formatTanggalPendek(weekStart) }} – {{ formatTanggalPendek(weekEnd) }}
      <BaseBadge v-if="alreadySaved" text="Sudah Disimpan" variant="success" class="saved-badge" />
    </h2>

    <AlertMessage :type="alertType" :message="alertMsg" @close="clearAlert" />

    <div v-if="weeklyTrx.length === 0" class="no-trx">
      Tidak ada transaksi pada minggu ini. Total pendapatan: <strong>Rp0</strong>.
    </div>

    <div class="calc-grid">
      <div class="calc-item">
        <span class="label">Total Pendapatan</span>
        <strong class="calc-val">{{ formatRupiah(totalRevenue) }}</strong>
        <span class="calc-hint">{{ weeklyTrx.length }} transaksi</span>
      </div>
      <div class="calc-item">
        <span class="label">Karyawan Dibagi</span>
        <strong class="calc-val">{{ empCount }} orang</strong>
        <span class="calc-hint">{{ eligibleEmployees.map(u => u.name).join(', ') || '-' }}</span>
      </div>
      <div class="calc-item">
        <span class="label">Estimasi Per Orang</span>
        <strong class="calc-val primary">{{ formatRupiah(previewPerPerson) }}</strong>
        <span v-if="previewRemainder > 0" class="calc-hint">Sisa: {{ formatRupiah(previewRemainder) }}</span>
      </div>
    </div>

    <PayrollSavePanel
      v-if="isOwner && !alreadySaved"
      ref="savePanelRef"
      :total-revenue="totalRevenue"
      :week-start="weekStart"
      :week-end="weekEnd"
      @save="handleSave"
    />
    <p v-else-if="!isOwner" class="view-only-hint">Hanya Kepala Cabang yang dapat menyimpan rekap.</p>
  </div>

  <div v-else class="calc-empty card">
    <span style="font-size:28px">📅</span>
    <span>Pilih periode minggu terlebih dahulu untuk melihat kalkulasi.</span>
  </div>
</template>

<style scoped>
.calc-panel   { margin-bottom: 20px; }
.calc-title   { font-size: var(--text-subheading); margin-bottom: 16px; display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
.saved-badge  { margin-left: 4px; }
.no-trx { display: flex; align-items: center; gap: 8px; font-size: var(--text-body); color: #9CA3AF; padding: 12px 14px; background: #F9FAFB; border-radius: 10px; margin-bottom: 16px; }
.calc-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(170px, 1fr)); gap: 14px; margin-bottom: 4px; }
.calc-item {
  display: flex; flex-direction: column; gap: 6px; padding: 16px;
  background: #F9FAFB; border: 1px solid #F3F4F6; border-radius: var(--radius-card);
  transition: box-shadow var(--transition-fast);
}
.calc-item:hover { box-shadow: var(--shadow-sm); }
.calc-val     { font-family: var(--font-heading); font-size: 20px; font-weight: 700; color: var(--color-secondary); }
.calc-val.primary { color: var(--color-primary); }
.calc-hint    { font-size: var(--text-label); color: #9CA3AF; word-break: break-word; line-height: 1.5; }
.view-only-hint { font-size: var(--text-label); color: #9CA3AF; margin-top: 14px; font-style: italic; }
.calc-empty {
  display: flex; flex-direction: column; align-items: center; gap: 8px;
  color: #9CA3AF; text-align: center; padding: 48px 24px; font-size: var(--text-body);
}
</style>
