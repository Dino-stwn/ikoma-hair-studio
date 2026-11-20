<script setup>
import { ref, computed } from 'vue'
import MainLayout   from '@/layouts/MainLayout.vue'
import WeekPicker   from '@/components/features/payrolls/WeekPicker.vue'
import ReportSummary from '@/components/features/reports/ReportSummary.vue'
import ExportButton  from '@/components/features/reports/ExportButton.vue'
import { useTransactionsStore } from '@/stores/transactions'
import { useServicesStore }     from '@/stores/services'
import { useUsersStore }        from '@/stores/users'
import { formatTanggalPendek }  from '@/utils/format'

const trxStore = useTransactionsStore()
const svcStore = useServicesStore()
const usrStore = useUsersStore()

// ── Periode minggu yang dipilih ────────────────────────────────────────────
const weekStart = ref('')
const weekEnd   = ref('')

function onWeekChange({ weekStart: s, weekEnd: e }) {
  weekStart.value = s
  weekEnd.value   = e
}

// ── Transaksi dalam minggu terpilih ───────────────────────────────────────
// Rumus IDENTIK dengan PayrollCalculation.vue agar angka konsisten
const weeklyTrx = computed(() => {
  if (!weekStart.value) return []
  return trxStore.transactions.filter(
    t => t.trx_date >= weekStart.value && t.trx_date <= weekEnd.value
  )
})

const hasWeek = computed(() => !!weekStart.value)
</script>

<template>
  <MainLayout>
    <div class="laporan-page">
      <!-- Header -->
      <div class="page-header">
        <div class="header-top">
          <div>
            <h1>Laporan Mingguan</h1>
            <p class="page-sub">Ringkasan pendapatan per minggu — hanya baca.</p>
          </div>
          <ExportButton
            :week-start="weekStart"
            :week-end="weekEnd"
            :transactions="weeklyTrx"
            :services="svcStore.services"
            :users="usrStore.users"
          />
        </div>
      </div>

      <!-- Pemilih minggu (dipakai ulang dari Penggajian) -->
      <WeekPicker @change="onWeekChange" />

      <!-- Belum pilih minggu -->
      <div v-if="!hasWeek" class="empty-week card">
        Pilih periode minggu di atas untuk melihat laporan.
      </div>

      <!-- Tidak ada transaksi -->
      <div v-else-if="weeklyTrx.length === 0" class="empty-week card">
        <strong>Tidak ada transaksi</strong> pada minggu
        {{ formatTanggalPendek(weekStart) }} – {{ formatTanggalPendek(weekEnd) }}.
        Total pendapatan: <strong>Rp0</strong>.
      </div>

      <!-- Konten laporan -->
      <template v-else>
        <div class="period-label">
          Periode:
          <strong>{{ formatTanggalPendek(weekStart) }} – {{ formatTanggalPendek(weekEnd) }}</strong>
        </div>

        <ReportSummary
          :transactions="weeklyTrx"
          :services="svcStore.services"
          :users="usrStore.users"
        />
      </template>
    </div>
  </MainLayout>
</template>

<style scoped>
.laporan-page { display: flex; flex-direction: column; gap: 20px; }

.page-header { margin-bottom: 0; }
.header-top  { display: flex; justify-content: space-between; align-items: flex-start; gap: 16px; flex-wrap: wrap; }
.page-sub    { color: #6B7280; margin-top: 6px; font-size: var(--text-body); }

.empty-week {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  text-align: center;
  color: #9CA3AF;
  padding: 48px 24px;
  font-size: var(--text-body);
}

.period-label {
  font-size: var(--text-body);
  color: #6B7280;
  padding: 2px 0;
}
</style>
