<script setup>
import BaseBadge   from '@/components/common/BaseBadge.vue'
import BaseButton  from '@/components/common/BaseButton.vue'
import { formatRupiah } from '@/utils/format'
import { getStockStatus } from '@/stores/products'

defineProps({ rows: { type: Array, default: () => [] } })
defineEmits(['edit', 'restock'])
const typeLabel = { gel: 'Gel', powder: 'Powder' }
</script>

<template>
  <div class="table-wrapper">
    <table class="table">
      <thead>
        <tr>
          <th>No</th>
          <th>Nama Produk</th>
          <th>Jenis</th>
          <th>Harga</th>
          <th class="text-center">Stok</th>
          <th class="text-center">Min. Stok</th>
          <th class="text-center">Status</th>
          <th class="text-center col-actions">Aksi</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="rows.length === 0" class="tr-empty">
          <td colspan="8" class="empty-row">
            <div class="empty-cell">
              <span class="empty-icon">📭</span>
              <span>Belum ada produk.</span>
            </div>
          </td>
        </tr>
        <tr v-for="(row, idx) in rows" :key="row.id">
          <td data-label="No">{{ idx + 1 }}</td>
          <td class="col-name" data-label="Nama Produk">{{ row.name }}</td>
          <td data-label="Jenis">
            <BaseBadge :text="typeLabel[row.type] ?? row.type" :variant="row.type === 'gel' ? 'info' : 'neutral'" />
          </td>
          <td data-label="Harga">{{ formatRupiah(row.price) }}</td>
          <td class="text-center stok-cell" data-label="Stok">{{ row.stock }}</td>
          <td class="text-center" data-label="Min. Stok">{{ row.min_stock }}</td>
          <td class="text-center" data-label="Status">
            <BaseBadge :text="getStockStatus(row).label" :variant="getStockStatus(row).variant" />
          </td>
          <td class="text-center col-actions" data-label="Aksi">
            <div class="action-btns">
              <BaseButton label="Ubah" variant="secondary" class="btn-sm" @click="$emit('edit', row)" />
              <BaseButton label="+ Stok" variant="success" class="btn-sm" @click="$emit('restock', row)" />
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.table-wrapper { overflow-x: auto; }
.col-name    { min-width: 160px; font-weight: 600; color: var(--color-secondary); }
.col-actions { width: 150px; }
.empty-row   { text-align: center; padding: 48px 24px; color: #9CA3AF; }
.empty-cell  { display: flex; flex-direction: column; align-items: center; gap: 8px; }
.empty-icon  { font-size: 28px; }
.stok-cell   { font-weight: 600; }
.action-btns { display: flex; gap: 6px; justify-content: center; }
.btn-sm      { padding: 5px 10px !important; font-size: var(--text-label) !important; border-radius: 8px !important; }

@media (max-width: 640px) {
  .table, thead, tbody, tr, th, td { display: block; }
  thead tr { display: none; }
  tbody tr:not(.tr-empty) {
    background: var(--color-surface);
    border: 1px solid #F3F4F6;
    border-radius: var(--radius-card);
    margin-bottom: 12px;
    padding: 14px 16px;
    box-shadow: var(--shadow-sm);
  }
  tbody tr:not(.tr-empty) td {
    padding: 6px 0; border: none; display: flex;
    align-items: center; justify-content: space-between;
    gap: 8px; font-size: var(--text-body);
  }
  tbody tr:not(.tr-empty) td::before {
    content: attr(data-label); font-size: var(--text-label);
    font-weight: 600; color: #6B7280; text-transform: uppercase; letter-spacing: 0.3px;
  }
  .col-actions { width: 100%; margin-top: 6px; padding-top: 8px; border-top: 1px solid #F3F4F6 !important; }
  .action-btns { justify-content: flex-end; }
}
</style>
