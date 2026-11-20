<script setup>
import { computed } from 'vue'
import { formatRupiah } from '@/utils/format'

const props = defineProps({
  transactions: { type: Array, default: () => [] },
  services: { type: Array, default: () => [] },
  products: { type: Array, default: () => [] }
})

/** Hitung kemunculan & total pendapatan per layanan */
const topLayanan = computed(() => {
  const map = {}
  for (const t of props.transactions) {
    for (const item of t.items) {
      if (item.item_type !== 'service') continue
      if (!map[item.service_id]) map[item.service_id] = { count: 0, total: 0 }
      map[item.service_id].count += item.qty
      map[item.service_id].total += item.subtotal
    }
  }
  return Object.entries(map)
    .map(([id, v]) => {
      const svc = props.services.find(s => s.id === id)
      return { label: svc?.name ?? `Layanan #${id}`, ...v }
    })
    .sort((a, b) => b.total - a.total)
    .slice(0, 8)
})

/** Hitung kemunculan & total per produk */
const topProduk = computed(() => {
  const map = {}
  for (const t of props.transactions) {
    for (const item of t.items) {
      if (item.item_type !== 'product') continue
      if (!map[item.product_id]) map[item.product_id] = { count: 0, total: 0 }
      map[item.product_id].count += item.qty
      map[item.product_id].total += item.subtotal
    }
  }
  return Object.entries(map)
    .map(([id, v]) => {
      const prd = props.products.find(p => p.id === id)
      return { label: prd?.name ?? `Produk #${id}`, ...v }
    })
    .sort((a, b) => b.total - a.total)
})
</script>

<template>
  <div class="top-items">
    <!-- Layanan terlaris -->
    <div class="top-section">
      <h3 class="section-title">Layanan Terlaris</h3>
      <div v-if="topLayanan.length === 0" class="empty-hint">Tidak ada data layanan.</div>
      <table v-else class="rank-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Layanan</th>
            <th>Jml</th>
            <th>Pendapatan</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, i) in topLayanan" :key="row.label">
            <td class="rank">{{ i + 1 }}</td>
            <td>{{ row.label }}</td>
            <td class="num">{{ row.count }}×</td>
            <td class="num">{{ formatRupiah(row.total) }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Produk terlaris -->
    <div class="top-section">
      <h3 class="section-title">Produk Terlaris</h3>
      <div v-if="topProduk.length === 0" class="empty-hint">Tidak ada penjualan produk.</div>
      <table v-else class="rank-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Produk</th>
            <th>Jml</th>
            <th>Pendapatan</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, i) in topProduk" :key="row.label">
            <td class="rank">{{ i + 1 }}</td>
            <td>{{ row.label }}</td>
            <td class="num">{{ row.count }}×</td>
            <td class="num">{{ formatRupiah(row.total) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.top-items { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
.top-section {
  background: var(--color-surface);
  border: 1px solid rgba(0, 0, 0, 0.05);
  border-radius: var(--radius-card);
  padding: 20px;
  box-shadow: var(--shadow-sm);
}
.section-title { font-family: var(--font-heading); font-size: 14px; font-weight: 600; color: var(--color-secondary); margin-bottom: 14px; }
.empty-hint { color: #9CA3AF; font-size: 13px; padding: 12px 0; }
.rank-table { width: 100%; border-collapse: collapse; font-size: 13px; }
.rank-table th { text-align: left; padding: 8px 8px; color: #6B7280; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.3px; border-bottom: 2px solid #F3F4F6; }
.rank-table td { padding: 9px 8px; border-bottom: 1px solid #F9FAFB; }
.rank-table tr:hover td { background-color: rgba(201,162,39,0.03); }
.rank-table tr:last-child td { border-bottom: none; }
.rank { font-weight: 700; color: var(--color-primary); width: 28px; }
.num { text-align: right; white-space: nowrap; }

@media (max-width: 700px) {
  .top-items { grid-template-columns: 1fr; }
}
</style>
