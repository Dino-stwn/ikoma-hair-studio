<script setup>
/**
 * ReportSummary.vue — Ringkasan mingguan untuk LaporanView (baca saja).
 * Angka totalRevenue IDENTIK dengan yang dipakai PayrollCalculation.
 */
import { computed } from 'vue'
import BaseBadge        from '@/components/common/BaseBadge.vue'
import ReportDetailTable from '@/components/features/reports/ReportDetailTable.vue'
import { formatRupiah } from '@/utils/format'
import { PAYMENT_BADGE } from '@/utils/constants'

const props = defineProps({
  transactions: { type: Array, default: () => [] },
  services:     { type: Array, default: () => [] },
  users:        { type: Array, default: () => [] }
})

// ── Ringkasan utama ────────────────────────────────────────────────────────
const totalRevenue = computed(() => props.transactions.reduce((s, t) => s + t.total, 0))
const totalTrx     = computed(() => props.transactions.length)
const rataRata     = computed(() => totalTrx.value ? Math.floor(totalRevenue.value / totalTrx.value) : 0)

// ── Per metode bayar ───────────────────────────────────────────────────────
const metodeColumns = [
  { key: 'label',  label: 'Metode' },
  { key: 'count',  label: 'Jml' },
  { key: 'value',  label: 'Pendapatan', align: 'right', currency: true },
  { key: 'pct',    label: '%',          align: 'right' }
]

const perMetode = computed(() => {
  const map = { tunai: 0, qris: 0, transfer: 0 }
  for (const t of props.transactions) {
    if (map[t.payment_method] !== undefined) map[t.payment_method] += t.total
  }
  return Object.entries(map).map(([k, v]) => ({
    _key: k,
    label: PAYMENT_BADGE[k]?.label ?? k,
    variant: PAYMENT_BADGE[k]?.variant ?? 'neutral',
    count: props.transactions.filter(t => t.payment_method === k).length,
    value: v,
    pct:   totalRevenue.value ? (v / totalRevenue.value * 100).toFixed(1) + '%' : '0%'
  }))
})

// ── Per layanan ────────────────────────────────────────────────────────────
const layananColumns = [
  { key: 'name',  label: 'Layanan' },
  { key: 'qty',   label: 'Jml' },
  { key: 'total', label: 'Pendapatan', align: 'right', currency: true }
]

const perLayanan = computed(() => {
  const map = {}
  for (const t of props.transactions) {
    for (const item of t.items) {
      if (item.item_type !== 'service') continue
      const id = item.service_id
      if (!map[id]) map[id] = { qty: 0, total: 0 }
      map[id].qty += item.qty; map[id].total += item.subtotal
    }
  }
  return Object.entries(map)
    .map(([id, v]) => ({ name: props.services.find(s => s.id === id)?.name ?? `Layanan #${id}`, ...v }))
    .sort((a, b) => b.total - a.total)
})

// ── Per karyawan ───────────────────────────────────────────────────────────
const karyawanColumns = [
  { key: 'name',  label: 'Nama' },
  { key: 'count', label: 'Trx' },
  { key: 'total', label: 'Total Dicatat', align: 'right', currency: true }
]

const perKaryawan = computed(() => {
  const map = {}
  for (const t of props.transactions) {
    if (!map[t.user_id]) map[t.user_id] = { count: 0, total: 0 }
    map[t.user_id].count++; map[t.user_id].total += t.total
  }
  return Object.entries(map)
    .map(([uid, v]) => ({ name: props.users.find(u => u.id === uid)?.name ?? `User #${uid}`, ...v }))
    .sort((a, b) => b.total - a.total)
})
</script>

<template>
  <div class="report-summary">
    <!-- Ringkasan utama -->
    <div class="summary-hero">
      <div class="hero-item">
        <span class="hero-label">Total Pendapatan</span>
        <span class="hero-value">{{ formatRupiah(totalRevenue) }}</span>
      </div>
      <div class="hero-divider"></div>
      <div class="hero-item">
        <span class="hero-label">Jumlah Transaksi</span>
        <span class="hero-value">{{ totalTrx }}</span>
      </div>
      <div class="hero-divider"></div>
      <div class="hero-item">
        <span class="hero-label">Rata-rata / Transaksi</span>
        <span class="hero-value">{{ formatRupiah(rataRata) }}</span>
      </div>
    </div>

    <!-- Tiga kolom rincian -->
    <div class="detail-grid">
      <!-- Per metode bayar (custom cell untuk badge) -->
      <ReportDetailTable title="Per Metode Bayar" :columns="metodeColumns" :rows="perMetode" empty="Tidak ada transaksi.">
        <template #label="{ row }">
          <BaseBadge :text="row.label" :variant="row.variant" />
        </template>
      </ReportDetailTable>

      <!-- Per layanan -->
      <ReportDetailTable title="Per Layanan" :columns="layananColumns" :rows="perLayanan" empty="Tidak ada data layanan." />

      <!-- Per karyawan -->
      <ReportDetailTable title="Per Karyawan (Pencatat)" :columns="karyawanColumns" :rows="perKaryawan" />
    </div>
  </div>
</template>

<style scoped>
.report-summary { display: flex; flex-direction: column; gap: 20px; }

.summary-hero {
  display: flex; align-items: stretch;
  background: var(--color-secondary); border-radius: 10px; overflow: hidden;
}
.hero-item    { flex: 1; padding: 20px 24px; display: flex; flex-direction: column; gap: 6px; }
.hero-label   { font-size: 11px; color: #9CA3AF; text-transform: uppercase; letter-spacing: 0.5px; }
.hero-value   { font-family: var(--font-heading); font-size: 24px; font-weight: 700; color: #fff; }
.hero-divider { width: 1px; background: rgba(255,255,255,0.15); margin: 16px 0; }

.detail-grid {
  display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px;
}

@media (max-width: 900px) {
  .detail-grid  { grid-template-columns: 1fr; }
  .summary-hero { flex-direction: column; }
  .hero-divider { width: 100%; height: 1px; margin: 0; }
}
</style>
