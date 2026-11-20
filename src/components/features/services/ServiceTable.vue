<script setup>
import BaseTable  from '@/components/common/BaseTable.vue'
import BaseBadge  from '@/components/common/BaseBadge.vue'
import BaseButton from '@/components/common/BaseButton.vue'
import { formatRupiah } from '@/utils/format'

defineProps({
  rows: { type: Array, default: () => [] }
})
defineEmits(['edit', 'delete'])

const columns = [
  { key: 'no',    label: 'No' },
  { key: 'name',  label: 'Nama Layanan' },
  { key: 'price', label: 'Harga' },
  { key: 'is_active', label: 'Status' }
]
</script>

<template>
  <BaseTable
    :columns="columns"
    :rows="rows"
    :show-actions="true"
    empty-text="Belum ada layanan aktif."
    @edit="$emit('edit', $event)"
    @delete="$emit('delete', $event)"
  >
    <!-- Nomor urut -->
    <template #cell-no="{ row }">
      {{ rows.indexOf(row) + 1 }}
    </template>

    <!-- Harga -->
    <template #cell-price="{ value }">
      {{ formatRupiah(value) }}
    </template>

    <!-- Status -->
    <template #cell-is_active="{ value }">
      <BaseBadge
        :text="value ? 'Aktif' : 'Nonaktif'"
        :variant="value ? 'success' : 'danger'"
      />
    </template>
  </BaseTable>
</template>
