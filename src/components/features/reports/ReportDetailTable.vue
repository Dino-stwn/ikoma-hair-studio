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
    <div v-if="rows.length === 0" class="empty-hint">{{ empty }}</div>
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
.detail-card  { background: #fff; border: 1px solid var(--color-border, #E5E7EB); border-radius: 8px; padding: 16px; }
.detail-title { font-size: 13px; font-weight: 700; color: var(--color-secondary); margin-bottom: 12px; }
.empty-hint   { font-size: 13px; color: #9CA3AF; }
.detail-table { width: 100%; border-collapse: collapse; font-size: 12px; }
.detail-table th { text-align: left; padding: 5px 6px; color: #6B7280; font-weight: 600; border-bottom: 1px solid #F3F4F6; }
.detail-table td { padding: 6px 6px; border-bottom: 1px solid #F9FAFB; }
.detail-table tr:last-child td { border-bottom: none; }
.text-right { text-align: right !important; }
.mono       { font-family: monospace; white-space: nowrap; }
</style>
