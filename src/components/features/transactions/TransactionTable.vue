<script setup>
/**
 * TransactionTable.vue
 * Tabel transaksi yang berdiri sendiri: nama user dan ringkasan item
 * diselesaikan secara internal lewat store sehingga pemanggil cukup
 * meneruskan array transaksi mentah dari store.
 */
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

// ── Resolusi nama ──────────────────────────────────────────────────────────
function resolveItemName(item) {
  if (item.item_type === 'service')
    return svcStore.services.find((s) => s.id === item.service_id)?.name ?? 'Layanan'
  return prdStore.products.find((p) => p.id === item.product_id)?.name ?? 'Produk'
}

function getItemSummary(items) {
  if (!items?.length) return '-'
  const names = items.map(resolveItemName)
  if (names.length <= 2) return names.join(', ')
  return `${names[0]} +${names.length - 1} lainnya`
}

/** Enrich setiap baris dengan userName dan itemSummary */
const enriched = computed(() =>
  props.rows.map((t) => ({
    ...t,
    userName:    usrStore.getById(t.user_id)?.name ?? t.user_id,
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
        <tr v-if="enriched.length === 0">
          <td :colspan="showActions ? 7 : 6" class="empty-row">Tidak ada transaksi.</td>
        </tr>
        <tr v-for="row in enriched" :key="row.id">
          <td class="col-code">{{ row.code }}</td>
          <td class="col-date">{{ formatTanggalPendek(row.trx_date) }}</td>
          <td>{{ row.userName }}</td>
          <td>
            <BaseBadge
              :text="PAYMENT_BADGE[row.payment_method]?.label ?? row.payment_method"
              :variant="PAYMENT_BADGE[row.payment_method]?.variant ?? 'neutral'"
            />
          </td>
          <td class="col-items">
            <span class="item-summary">{{ row.itemSummary }}</span>
            <span v-if="row.note" class="item-note">📝 {{ row.note }}</span>
          </td>
          <td class="text-right col-total">{{ formatRupiah(row.total) }}</td>
          <td v-if="showActions" class="col-aksi text-center">
            <div class="aksi-btns">
              <BaseButton label="Ubah"  variant="secondary" class="btn-sm" @click="$emit('edit', row)" />
              <BaseButton label="Hapus" variant="danger"    class="btn-sm" @click="$emit('delete', row)" />
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.table-wrapper { overflow-x: auto; }
.empty-row { text-align: center; padding: 32px; color: #9CA3AF; font-style: italic; }
.col-code  { font-family: monospace; white-space: nowrap; }
.col-date  { white-space: nowrap; }
.col-items { max-width: 240px; }
.col-total { white-space: nowrap; font-weight: 600; }
.col-aksi  { width: 120px; }
.item-summary { display: block; font-size: var(--text-body); }
.item-note    { display: block; font-size: var(--text-label); color: #6B7280; margin-top: 2px; }
.aksi-btns { display: flex; gap: 6px; justify-content: center; }
.btn-sm    { padding: 4px 8px !important; font-size: var(--text-label) !important; }
</style>
