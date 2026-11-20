<script setup>
import { useUsersStore } from '@/stores/users'
import { formatRupiah, formatTanggalPendek } from '@/utils/format'

defineProps({
  rows: { type: Array, default: () => [] }
})

const usersStore = useUsersStore()

function creatorName(userId) {
  return usersStore.getById(userId)?.name ?? userId
}

function computedRemainder(payroll) {
  const paid = payroll.details.reduce((s, d) => s + d.amount, 0)
  return payroll.net_total - paid
}

function empCount(payroll) {
  return payroll.details.length
}


</script>

<template>
  <div>
    <h2 class="section-title">Riwayat Rekap Gaji</h2>

    <div v-if="rows.length === 0" class="empty-state">
      Belum ada rekap gaji yang disimpan.
    </div>

    <div v-else class="table-wrapper">
      <table class="table">
        <thead>
          <tr>
            <th>Periode</th>
            <th class="text-right">Total Pendapatan</th>
            <th class="text-right">Potongan</th>
            <th class="text-right">Bersih</th>
            <th class="text-center">Jml Karyawan</th>
            <th class="text-right">Per Orang</th>
            <th class="text-right">Sisa</th>
            <th>Dibuat Oleh</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="p in rows" :key="p.id">
            <td class="col-period">
              {{ formatTanggalPendek(p.week_start) }} –<br>{{ formatTanggalPendek(p.week_end) }}
            </td>
            <td class="text-right">{{ formatRupiah(p.total_revenue) }}</td>
            <td class="text-right">{{ formatRupiah(p.deduction) }}</td>
            <td class="text-right fw-bold">{{ formatRupiah(p.net_total) }}</td>
            <td class="text-center">{{ empCount(p) }}</td>
            <td class="text-right fw-bold primary">
              {{ empCount(p) > 0 ? formatRupiah(p.details[0]?.amount ?? 0) : '-' }}
            </td>
            <td class="text-right">
              <span :class="computedRemainder(p) > 0 ? 'remainder' : 'text-muted'">
                {{ formatRupiah(computedRemainder(p)) }}
              </span>
            </td>
            <td>{{ creatorName(p.created_by) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.section-title { font-size: var(--text-subheading); margin-bottom: 14px; }

.empty-state {
  text-align: center; padding: 32px;
  color: #9CA3AF; font-style: italic;
}

.table-wrapper { overflow-x: auto; }

.col-period { white-space: nowrap; line-height: 1.6; }
.fw-bold    { font-weight: 700; }
.primary    { color: var(--color-primary); }
.text-muted { color: #9CA3AF; }
.remainder  { color: var(--color-warning); font-weight: 600; }
</style>
