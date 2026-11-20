<script setup>
import { computed } from 'vue'
import BaseBadge  from '@/components/common/BaseBadge.vue'
import BaseButton from '@/components/common/BaseButton.vue'
import { useUsersStore }    from '@/stores/users'
import { useServicesStore } from '@/stores/services'
import { useProductsStore } from '@/stores/products'
import { formatRupiah, formatTanggalPendek } from '@/utils/format'
import { PAYMENT_BADGE } from '@/utils/constants'

const props = defineProps({
  rows:        { type: Array,   default: () => [] },
  showActions: { type: Boolean, default: false }
})
defineEmits(['edit', 'delete'])

const usrStore = useUsersStore()
const svcStore = useServicesStore()
const prdStore = useProductsStore()

function resolveItemName(item) {
  if (item.item_type === 'service') return svcStore.services.find((s) => s.id === item.service_id)?.name ?? 'Layanan'
  return prdStore.products.find((p) => p.id === item.product_id)?.name ?? 'Produk'
}

function getItemSummary(items) {
  if (!items?.length) return '-'
  const names = items.map(resolveItemName)
  if (names.length <= 2) return names.join(', ')
  return `${names[0]} +${names.length - 1} lainnya`
}

const enriched = computed(() =>
  props.rows.map((t) => ({
    ...t,
    userName: usrStore.getById(t.user_id)?.name ?? t.user_id,
    itemSummary: getItemSummary(t.items)
  }))
)
</script>

<template>
  <div class="table-wrapper">
    <table class="table">
      <thead>
        <tr>
          <th>Kode</th>
          <th>Tanggal</th>
          <th>Pencatat</th>
          <th>Metode</th>
          <th>Ringkasan Item</th>
          <th class="text-right">Total</th>
          <th v-if="showActions" class="col-aksi text-center">Aksi</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="enriched.length === 0" class="tr-empty">
          <td :colspan="showActions ? 7 : 6" class="empty-row">
            <div class="empty-cell">
              <span class="empty-icon">📭</span>
              <span>Tidak ada transaksi.</span>
            </div>
          </td>
        </tr>
        <tr v-for="row in enriched" :key="row.id">
          <td class="col-code">{{ row.code }}</td>
          <td class="col-date">{{ formatTanggalPendek(row.trx_date) }}</td>
          <td>{{ row.userName }}</td>
          <td>
            <BaseBadge :text="PAYMENT_BADGE[row.payment_method]?.label ?? row.payment_method" :variant="PAYMENT_BADGE[row.payment_method]?.variant ?? 'neutral'" />
          </td>
          <td class="col-items">
            <span class="item-summary">{{ row.itemSummary }}</span>
            <span v-if="row.note" class="item-note">📝 {{ row.note }}</span>
          </td>
          <td class="text-right col-total">{{ formatRupiah(row.total) }}</td>
          <td v-if="showActions" class="col-aksi text-center">
            <div class="aksi-btns">
              <BaseButton label="Ubah" variant="secondary" class="btn-sm" @click="$emit('edit', row)" />
              <BaseButton label="Hapus" variant="danger" class="btn-sm" @click="$emit('delete', row)" />
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.table-wrapper { overflow-x: auto; }
.empty-row { text-align: center; padding: 48px 24px; color: #9CA3AF; }
.empty-cell { display: flex; flex-direction: column; align-items: center; gap: 8px; }
.empty-icon { font-size: 28px; }
.col-code { font-family: monospace; white-space: nowrap; font-weight: 600; color: var(--color-secondary); }
.col-date { white-space: nowrap; color: #374151; }
.col-items { max-width: 240px; }
.col-total { white-space: nowrap; font-weight: 700; font-family: var(--font-heading); color: var(--color-secondary); }
.col-aksi { width: 130px; }
.item-summary { display: block; font-size: var(--text-body); }
.item-note { display: block; font-size: var(--text-label); color: #6B7280; margin-top: 2px; }
.aksi-btns { display: flex; gap: 6px; justify-content: center; }
.btn-sm { padding: 5px 10px !important; font-size: var(--text-label) !important; border-radius: 8px !important; }

@media (max-width: 640px) {
  .table, thead, tbody, tr, th, td { display: block; }
  thead tr { display: none; }
  tbody tr:not(.tr-empty) {
    background: var(--color-surface); border: 1px solid #F3F4F6;
    border-radius: var(--radius-card); margin-bottom: 12px; padding: 14px 16px; box-shadow: var(--shadow-sm);
  }
  tbody tr:not(.tr-empty) td {
    padding: 6px 0; border: none; display: flex;
    align-items: center; justify-content: space-between; gap: 8px; font-size: var(--text-body);
  }
  tbody tr:not(.tr-empty) td::before {
    content: attr(data-label); font-size: var(--text-label); font-weight: 600; color: #6B7280; text-transform: uppercase; letter-spacing: 0.3px;
  }
  .col-code::before { content: 'Kode'; }
  .col-date::before { content: 'Tanggal'; }
  .col-items::before { content: 'Item'; }
  .col-total { text-align: left; }
  .col-total::before { content: 'Total'; }
  .col-aksi { width: 100%; border-top: 1px solid #F3F4F6 !important; margin-top: 6px; padding-top: 8px !important; }
  .col-aksi .aksi-btns { justify-content: flex-end; }
}
</style>
