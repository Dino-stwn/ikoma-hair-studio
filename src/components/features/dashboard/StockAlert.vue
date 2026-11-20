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
      <strong>Peringatan Stok</strong>
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
  background: #FFF7ED;
  border: 1px solid #FED7AA;
  border-left: 4px solid var(--color-warning, #F59E0B);
  border-radius: 8px;
  padding: 14px 18px;
}
.alert-header {
  display: flex; align-items: center; gap: 8px;
  margin-bottom: 10px;
}
.alert-icon   { font-size: 16px; }
.alert-count  { margin-left: auto; font-size: 12px; color: #92400E; }
.alert-list   { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 6px; }
.alert-item   { display: flex; align-items: center; gap: 10px; font-size: 13px; }
.product-name { font-weight: 600; color: #1F2937; flex: 1; }
.product-stock{ color: #6B7280; white-space: nowrap; }
</style>
