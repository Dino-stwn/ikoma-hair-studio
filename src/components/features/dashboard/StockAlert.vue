<script setup>
import { computed } from 'vue'
import BaseBadge from '@/components/common/BaseBadge.vue'
import { getStockStatus } from '@/stores/products'

const props = defineProps({
  products: { type: Array, default: () => [] }
})

/** Hanya tampilkan produk dengan status Habis atau Menipis */
const alertProducts = computed(() =>
  props.products.filter(p => {
    const s = getStockStatus(p)
    return s.variant === 'danger' || s.variant === 'warning'
  })
)
</script>

<template>
  <div v-if="alertProducts.length" class="stock-alert">
    <div class="alert-header">
      <span class="alert-icon">⚠️</span>
      <strong class="alert-title">Peringatan Stok</strong>
      <span class="alert-count">{{ alertProducts.length }} produk perlu perhatian</span>
    </div>
    <ul class="alert-list">
      <li v-for="p in alertProducts" :key="p.id" class="alert-item">
        <span class="product-name">{{ p.name }}</span>
        <span class="product-stock">Stok: {{ p.stock }} / Min: {{ p.min_stock }}</span>
        <BaseBadge :text="getStockStatus(p).label" :variant="getStockStatus(p).variant" />
      </li>
    </ul>
  </div>
</template>

<style scoped>
.stock-alert {
  background: rgba(245, 158, 11, 0.07);
  border: 1px solid rgba(245, 158, 11, 0.25);
  border-left: 4px solid var(--color-warning);
  border-radius: var(--radius-card);
  padding: 16px 20px;
  margin-bottom: 20px;
}

.alert-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}

.alert-icon   { font-size: 16px; }
.alert-title  { font-size: var(--text-body); color: #92400E; }
.alert-count  { margin-left: auto; font-size: var(--text-label); color: #92400E; opacity: 0.8; }

.alert-list { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 8px; }

.alert-item {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: var(--text-body);
  padding: 8px 10px;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 8px;
}

.product-name  { font-weight: 600; color: var(--color-secondary); flex: 1; }
.product-stock { color: #6B7280; white-space: nowrap; font-size: var(--text-label); }
</style>
