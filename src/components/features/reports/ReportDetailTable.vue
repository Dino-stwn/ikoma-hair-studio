<script setup>
/**
 * ReportDetailTable.vue — Tabel rincian reusable untuk laporan mingguan.
 * Dipakai oleh ReportSummary untuk bagian per-layanan dan per-karyawan.
 */
import { formatRupiah } from '@/utils/format'

defineProps({
  title:   { type: String, default: '' },
  columns: { type: Array,  default: () => [] }, // [{ key, label, align }]
  rows:    { type: Array,  default: () => [] },
  empty:   { type: String, default: 'Tidak ada data.' }
})
</script>

<template>
  <div class="detail-card">
    <h3 class="detail-title">{{ title }}</h3>
    <div v-if="rows.length === 0" class="empty-hint">
      <span class="empty-icon">📊</span>
      <span>{{ empty }}</span>
    </div>
    <table v-else class="detail-table">
      <thead>
        <tr>
          <th v-for="col in columns" :key="col.key" :class="col.align === 'right' ? 'text-right' : ''">
            {{ col.label }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in rows" :key="row._key ?? row.name">
          <td v-for="col in columns" :key="col.key" :class="[col.align === 'right' ? 'text-right' : '', col.mono ? 'mono' : '']">
            <slot :name="col.key" :value="row[col.key]" :row="row">
              {{ col.currency ? formatRupiah(row[col.key]) : row[col.key] }}
            </slot>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.detail-card {
  background: var(--color-surface);
  border: 1px solid rgba(0, 0, 0, 0.05);
  border-radius: var(--radius-card);
  padding: 20px;
  box-shadow: var(--shadow-sm);
}
.detail-title {
  font-family: var(--font-heading);
  font-size: 14px;
  font-weight: 600;
  color: var(--color-secondary);
  margin-bottom: 14px;
}
.empty-hint {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: #9CA3AF;
  padding: 12px 0;
}
.empty-icon { font-size: 16px; }
.detail-table { width: 100%; border-collapse: collapse; font-size: 13px; }
.detail-table th {
  text-align: left;
  padding: 8px 8px;
  color: #6B7280;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.3px;
  border-bottom: 2px solid #F3F4F6;
}
.detail-table td { padding: 9px 8px; border-bottom: 1px solid #F9FAFB; }
.detail-table tr:hover td { background-color: rgba(201,162,39,0.03); }
.detail-table tr:last-child td { border-bottom: none; }
.text-right { text-align: right !important; }
.mono       { font-family: monospace; white-space: nowrap; }
</style>
