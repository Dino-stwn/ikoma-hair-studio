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
      <span class="cart-empty__icon">🛒</span>
      <span>Belum ada item. Tambahkan dari panel kiri.</span>
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
          <p v-if="item.note" class="cart-item__note">{{ item.note }}</p>
        </div>

        <!-- Tombol hapus -->
        <button class="btn-remove" aria-label="Hapus item" @click="$emit('remove', idx)">✕</button>
      </div>
    </div>

    <!-- Total -->
    <div class="cart-total">
      <span class="cart-total__label">Total</span>
      <strong class="cart-total__value">{{ formatRupiah(total) }}</strong>
    </div>
  </div>
</template>

<style scoped>
.cart { display: flex; flex-direction: column; gap: 12px; }

.cart-title {
  font-size: var(--text-subheading);
  font-family: var(--font-heading);
  font-weight: 600;
  color: var(--color-secondary);
}

.cart-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 36px 0;
  color: #9CA3AF;
  font-size: var(--text-body);
  text-align: center;
}

.cart-empty__icon { font-size: 32px; }

.cart-items { display: flex; flex-direction: column; gap: 8px; }

.cart-item {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 10px;
  padding: 12px 14px;
  background: #F9FAFB;
  border-radius: 10px;
  border: 1px solid #F3F4F6;
  transition: border-color var(--transition-fast);
}

.cart-item--modified {
  border-left: 3px solid var(--color-warning);
  background: rgba(245, 158, 11, 0.04);
}

.cart-item__main { flex: 1; min-width: 0; }

.cart-item__info {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 5px;
  flex-wrap: wrap;
}

.cart-item__name  { font-weight: 600; font-size: var(--text-body); color: var(--color-secondary); }
.cart-item__detail { font-size: var(--text-body); color: #374151; }
.price-strike      { color: #9CA3AF; font-size: var(--text-label); text-decoration: line-through; }
.cart-item__note   { font-size: var(--text-label); color: #6B7280; margin-top: 4px; }

.btn-remove {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 26px;
  border-radius: 6px;
  background: rgba(220, 38, 38, 0.1);
  border: none;
  cursor: pointer;
  color: var(--color-danger);
  font-size: 12px;
  flex-shrink: 0;
  align-self: flex-start;
  transition: background var(--transition-fast);
}
.btn-remove:hover { background: rgba(220, 38, 38, 0.2); }

.cart-total {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 0 2px;
  border-top: 2px solid #E5E7EB;
}

.cart-total__label {
  font-size: var(--text-body);
  color: #6B7280;
  font-weight: 500;
}

.cart-total__value {
  font-family: var(--font-heading);
  font-size: var(--text-subheading);
  font-weight: 700;
  color: var(--color-secondary);
}
</style>
