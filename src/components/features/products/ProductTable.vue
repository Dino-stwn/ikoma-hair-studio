<script setup>
import BaseBadge   from '@/components/common/BaseBadge.vue'
import BaseButton  from '@/components/common/BaseButton.vue'
import { formatRupiah } from '@/utils/format'
import { getStockStatus } from '@/stores/products'

defineProps({
  rows: { type: Array, default: () => [] }
})
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
        <tr v-if="rows.length === 0">
          <td colspan="8" class="empty-row">Belum ada produk.</td>
        </tr>
        <tr v-for="(row, idx) in rows" :key="row.id">
          <td>{{ idx + 1 }}</td>
          <td class="col-name">{{ row.name }}</td>

          <!-- Jenis -->
          <td>
            <BaseBadge
              :text="typeLabel[row.type] ?? row.type"
              :variant="row.type === 'gel' ? 'info' : 'neutral'"
            />
          </td>

          <!-- Harga -->
          <td>{{ formatRupiah(row.price) }}</td>

          <!-- Stok -->
          <td class="text-center stok-cell">
            <span class="stok-val">{{ row.stock }}</span>
          </td>

          <!-- Min stok -->
          <td class="text-center">{{ row.min_stock }}</td>

          <!-- Status -->
          <td class="text-center">
            <BaseBadge
              :text="getStockStatus(row).label"
              :variant="getStockStatus(row).variant"
            />
          </td>

          <!-- Aksi -->
          <td class="text-center col-actions">
            <div class="action-btns">
              <BaseButton
                label="✏️"
                variant="secondary"
                class="btn-sm"
                @click="$emit('edit', row)"
              />
              <BaseButton
                label="+ Stok"
                variant="success"
                class="btn-sm"
                @click="$emit('restock', row)"
              />
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.table-wrapper { overflow-x: auto; }

.col-name   { min-width: 160px; }
.col-actions { width: 110px; }

.empty-row {
  text-align: center;
  padding: 32px;
  color: #9CA3AF;
  font-style: italic;
}

.stok-cell { font-weight: 600; }

.action-btns {
  display: flex;
  gap: 6px;
  justify-content: center;
  flex-wrap: nowrap;
}

.btn-sm {
  padding: 4px 8px !important;
  font-size: var(--text-label) !important;
  white-space: nowrap;
}

/* badge warna biru untuk jenis */
:deep(.badge-info) {
  background-color: #DBEAFE;
  color: #1D4ED8;
}
</style>
