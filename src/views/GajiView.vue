<script setup>
import { ref, computed } from 'vue'
import MainLayout          from '@/layouts/MainLayout.vue'
import WeekPicker          from '@/components/features/payrolls/WeekPicker.vue'
import PayrollCalculation  from '@/components/features/payrolls/PayrollCalculation.vue'
import PayrollTable        from '@/components/features/payrolls/PayrollTable.vue'
import { usePayrollsStore } from '@/stores/payrolls'

const payrollStore = usePayrollsStore()

const weekStart = ref('')
const weekEnd   = ref('')

function onWeekChange({ weekStart: s, weekEnd: e }) {
  weekStart.value = s
  weekEnd.value   = e
}

// Urutkan riwayat dari terbaru
const sortedPayrolls = computed(() =>
  [...payrollStore.payrolls].sort((a, b) =>
    b.week_start.localeCompare(a.week_start)
  )
)
</script>

<template>
  <MainLayout>
    <div class="page-header">
      <h1>Penggajian</h1>
      <p class="page-sub">Rekap gaji mingguan berdasarkan omzet barbershop.</p>
    </div>

    <!-- Pilih minggu -->
    <WeekPicker @change="onWeekChange" />

    <!-- Panel kalkulasi -->
    <PayrollCalculation :week-start="weekStart" :week-end="weekEnd" />

    <!-- Riwayat yang sudah disimpan -->
    <div class="card">
      <PayrollTable :rows="sortedPayrolls" />
    </div>
  </MainLayout>
</template>

<style scoped>
.page-header { margin-bottom: 20px; }
.page-sub    { color: #6B7280; margin-top: 6px; font-size: var(--text-body); }
</style>
