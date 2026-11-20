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
        <tr v-if="rows.length === 0">
          <td :colspan="columns.length + (showActions ? 1 : 0)" class="empty-row">
            {{ emptyText }}
          </td>
        </tr>
        <tr v-for="(row, rowIdx) in rows" :key="rowIdx">
          <td v-for="col in columns" :key="col.key">
            <!--
              Slot bernama cell-<key> memungkinkan isi sel kustom.
              Slot mendapat { row, value } sebagai scoped slot.
            -->
            <slot :name="`cell-${col.key}`" :row="row" :value="row[col.key]">
              {{ row[col.key] }}
            </slot>
          </td>
          <td v-if="showActions" class="col-actions">
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
.table-wrapper { overflow-x: auto; }

.empty-row {
  text-align: center;
  padding: 32px;
  color: #9CA3AF;
  font-style: italic;
}

.col-actions { width: 120px; text-align: center; }

.action-btns {
  display: flex;
  gap: 6px;
  justify-content: center;
}

.btn-sm {
  padding: 4px 10px;
  font-size: var(--text-label);
}
</style>
