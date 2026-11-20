<script setup>
import { computed } from 'vue'
import { formatRupiah } from '@/utils/format'

const props = defineProps({
  /** Array of { label: string, value: number } */
  bars: { type: Array, default: () => [] },
  title: { type: String, default: '' },
  colorVar: { type: String, default: '--color-primary' }
})

const max = computed(() => Math.max(...props.bars.map(b => b.value), 1))
</script>

<template>
  <div class="chart-wrap">
    <h3 class="chart-title" v-if="title">{{ title }}</h3>
    <div v-if="bars.length === 0" class="chart-empty">Tidak ada data.</div>
    <div v-else class="chart-bars">
      <div
        v-for="bar in bars"
        :key="bar.label"
        class="bar-item"
      >
        <div class="bar-track">
          <div
            class="bar-fill"
            :style="{
              width: (bar.value / max * 100) + '%',
              background: `var(${colorVar})`
            }"
          ></div>
        </div>
        <div class="bar-meta">
          <span class="bar-label">{{ bar.label }}</span>
          <span class="bar-value">{{ formatRupiah(bar.value) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.chart-wrap {
  background: var(--color-surface);
  border: 1px solid rgba(0, 0, 0, 0.05);
  border-radius: var(--radius-card);
  padding: 20px;
  box-shadow: var(--shadow-sm);
}
.chart-title { font-family: var(--font-heading); font-size: 14px; font-weight: 600; margin-bottom: 16px; color: var(--color-secondary); }
.chart-empty { color: #9CA3AF; font-size: 13px; padding: 12px 0; }
.chart-bars { display: flex; flex-direction: column; gap: 12px; }
.bar-item { display: flex; flex-direction: column; gap: 4px; }
.bar-track { height: 20px; background: #F3F4F6; border-radius: 6px; overflow: hidden; }
.bar-fill { height: 100%; border-radius: 6px; transition: width 0.4s ease; min-width: 2px; }
.bar-meta { display: flex; justify-content: space-between; font-size: 12px; }
.bar-label { color: #374151; font-weight: 500; }
.bar-value { font-weight: 600; color: var(--color-secondary); }
</style>
