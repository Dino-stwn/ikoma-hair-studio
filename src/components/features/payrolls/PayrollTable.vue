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
      <span>Belum ada rekap gaji yang disimpan.</span>
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
            <td class="col-period" data-label="Periode">
              {{ formatTanggalPendek(p.week_start) }} – {{ formatTanggalPendek(p.week_end) }}
            </td>
            <td class="text-right" data-label="Total">{{ formatRupiah(p.total_revenue) }}</td>
            <td class="text-right" data-label="Potongan">{{ formatRupiah(p.deduction) }}</td>
            <td class="text-right fw-bold" data-label="Bersih">{{ formatRupiah(p.net_total) }}</td>
            <td class="text-center" data-label="Jml Karyawan">{{ empCount(p) }}</td>
            <td class="text-right fw-bold primary" data-label="Per Orang">
              {{ empCount(p) > 0 ? formatRupiah(p.details[0]?.amount ?? 0) : '-' }}
            </td>
            <td class="text-right" data-label="Sisa">
              <span :class="computedRemainder(p) > 0 ? 'remainder' : 'text-muted'">
                {{ formatRupiah(computedRemainder(p)) }}
              </span>
            </td>
            <td data-label="Dibuat Oleh">{{ creatorName(p.created_by) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.section-title { font-size: var(--text-subheading); margin-bottom: 16px; font-weight: 600; color: var(--color-secondary); }

.empty-state {
  display: flex; flex-direction: column; align-items: center; gap: 8px;
  text-align: center; padding: 48px 24px; color: #9CA3AF;
}
.empty-icon { font-size: 28px; }

.table-wrapper { overflow-x: auto; }
.col-period { white-space: nowrap; line-height: 1.6; font-weight: 500; }
.fw-bold    { font-weight: 700; }
.primary    { color: var(--color-primary); }
.text-muted { color: #9CA3AF; }
.remainder  { color: var(--color-warning); font-weight: 600; }

@media (max-width: 640px) {
  .table, thead, tbody, tr, th, td { display: block; }
  thead tr { display: none; }
  tbody tr {
    background: var(--color-surface);
    border: 1px solid #F3F4F6;
    border-radius: var(--radius-card);
    margin-bottom: 12px;
    padding: 14px 16px;
    box-shadow: var(--shadow-sm);
  }
  tbody td {
    padding: 6px 0; border: none; display: flex;
    align-items: center; justify-content: space-between;
    gap: 8px; font-size: var(--text-body);
  }
  tbody td::before {
    content: attr(data-label); font-size: var(--text-label);
    font-weight: 600; color: #6B7280; text-transform: uppercase; letter-spacing: 0.3px;
  }
}
</style>
