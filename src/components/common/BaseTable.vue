<script setup>
defineProps({
  columns:     { type: Array,   default: () => [] }, // [{ key, label }]
  rows:        { type: Array,   default: () => [] },
  emptyText:   { type: String,  default: 'Tidak ada data.' },
  showActions: { type: Boolean, default: false }
})
defineEmits(['edit', 'delete'])
</script>

<template>
  <div class="table-wrapper">
    <table class="table">
      <thead>
        <tr>
          <th v-for="col in columns" :key="col.key">{{ col.label }}</th>
          <th v-if="showActions" class="col-actions">Aksi</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="rows.length === 0" class="tr-empty">
          <td :colspan="columns.length + (showActions ? 1 : 0)" class="empty-row">
            <div class="empty-cell">
              <span class="empty-icon">📭</span>
              <span>{{ emptyText }}</span>
            </div>
          </td>
        </tr>
        <tr v-for="(row, rowIdx) in rows" :key="rowIdx">
          <td v-for="col in columns" :key="col.key" :data-label="col.label">
            <!--
              Slot bernama cell-<key> memungkinkan isi sel kustom.
              Slot mendapat { row, value } sebagai scoped slot.
            -->
            <slot :name="`cell-${col.key}`" :row="row" :value="row[col.key]">
              {{ row[col.key] }}
            </slot>
          </td>
          <td v-if="showActions" class="col-actions" data-label="Aksi">
            <div class="action-btns">
              <button class="btn btn-secondary btn-sm" @click="$emit('edit', row)">Ubah</button>
              <button class="btn btn-danger btn-sm" @click="$emit('delete', row)">Hapus</button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.table-wrapper {
  overflow-x: auto;
  border-radius: var(--radius-card);
}

.empty-row {
  text-align: center;
  padding: 48px 24px;
  color: #9CA3AF;
}

.empty-cell {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.empty-icon { font-size: 28px; }

.col-actions { width: 130px; text-align: center; }

.action-btns {
  display: flex;
  gap: 6px;
  justify-content: center;
}

.btn-sm {
  padding: 5px 12px !important;
  font-size: var(--text-label) !important;
  border-radius: 8px !important;
}

/* Mobile: tampilan kartu bertumpuk */
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
    padding: 8px 0;
    border: none;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    font-size: var(--text-body);
  }
  tbody tr:not(.tr-empty) td::before {
    content: attr(data-label);
    font-size: var(--text-label);
    font-weight: 600;
    color: #6B7280;
    text-transform: uppercase;
    letter-spacing: 0.3px;
  }
  .col-actions {
    width: 100%;
    margin-top: 6px;
    padding-top: 8px;
    border-top: 1px solid #F3F4F6 !important;
  }
  .action-btns { justify-content: flex-end; }
}
</style>
