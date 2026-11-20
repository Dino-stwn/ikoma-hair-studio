<script setup>
import BaseBadge  from '@/components/common/BaseBadge.vue'
import BaseButton from '@/components/common/BaseButton.vue'
import { formatRupiah } from '@/utils/format'

defineProps({
  items: { type: Array, default: () => [] },
  total: { type: Number, default: 0 }
})
defineEmits(['remove'])
</script>

<template>
  <div class="cart">
    <h2 class="cart-title">Keranjang</h2>

    <div v-if="items.length === 0" class="cart-empty">
      Belum ada item. Tambahkan dari panel kiri.
    </div>

    <div v-else class="cart-items">
      <div
        v-for="(item, idx) in items"
        :key="idx"
        class="cart-item"
        :class="{ 'cart-item--modified': item.unit_price !== item.master_price }"
      >
        <div class="cart-item__main">
          <!-- Nama + jenis -->
          <div class="cart-item__info">
            <span class="cart-item__name">{{ item.name }}</span>
            <BaseBadge
              :text="item.item_type === 'service' ? 'Layanan' : 'Produk'"
              :variant="item.item_type === 'service' ? 'info' : 'neutral'"
            />
          </div>

          <!-- Rincian harga -->
          <p class="cart-item__detail">
            {{ item.qty }} × {{ formatRupiah(item.unit_price) }}
            <span v-if="item.unit_price !== item.master_price" class="price-strike">
              (master: {{ formatRupiah(item.master_price) }})
            </span>
            = <strong>{{ formatRupiah(item.subtotal) }}</strong>
          </p>

          <!-- Catatan -->
          <p v-if="item.note" class="cart-item__note">📝 {{ item.note }}</p>
        </div>

        <!-- Tombol hapus -->
        <BaseButton label="✕" variant="danger" class="btn-remove" @click="$emit('remove', idx)" />
      </div>
    </div>

    <!-- Total -->
    <div class="cart-total">
      <span>Total</span>
      <strong>{{ formatRupiah(total) }}</strong>
    </div>
  </div>
</template>

<style scoped>
.cart { display: flex; flex-direction: column; gap: 12px; }
.cart-title { font-size: var(--text-subheading); }

.cart-empty {
  text-align: center;
  padding: 32px 0;
  color: #9CA3AF;
  font-style: italic;
  font-size: var(--text-body);
}

.cart-items { display: flex; flex-direction: column; gap: 8px; }

.cart-item {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 10px;
  padding: 10px 12px;
  background: #F9FAFB;
  border-radius: 8px;
  border: 1px solid #E5E7EB;
}

.cart-item--modified { border-left: 3px solid var(--color-warning); }

.cart-item__main { flex: 1; min-width: 0; }

.cart-item__info {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
  flex-wrap: wrap;
}

.cart-item__name { font-weight: 600; font-size: var(--text-body); }

.cart-item__detail { font-size: var(--text-body); color: #374151; }

.price-strike { color: #9CA3AF; font-size: var(--text-label); text-decoration: line-through; }

.cart-item__note { font-size: var(--text-label); color: #6B7280; margin-top: 3px; }

.btn-remove {
  padding: 3px 7px !important;
  font-size: 12px !important;
  flex-shrink: 0;
  align-self: flex-start;
}

.cart-total {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0 0;
  border-top: 2px solid #E5E7EB;
  font-size: var(--text-subheading);
  font-family: var(--font-heading);
}

:deep(.badge-info) { background-color: #DBEAFE; color: #1D4ED8; }
</style>
