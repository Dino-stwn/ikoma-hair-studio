<script setup>
import { computed } from 'vue'
import { formatRupiah, formatTanggalPendek } from '@/utils/format'

const props = defineProps({
  transactions: { type: Array, default: () => [] },
  groupBy: { type: String, default: 'day' } // 'day' | 'week' | 'month'
})

function weekKey(isoDate) {
  const d = new Date(isoDate + 'T00:00:00')
  // ISO week: set to Monday of that week
  const day = d.getDay() || 7
  d.setDate(d.getDate() - (day - 1))
  return d.toISOString().split('T')[0]
}

function monthKey(isoDate) {
  return isoDate.slice(0, 7) // "YYYY-MM"
}

function getKey(trx) {
  if (props.groupBy === 'month') return monthKey(trx.trx_date)
  if (props.groupBy === 'week')  return weekKey(trx.trx_date)
  return trx.trx_date
}

function formatKey(key) {
  if (props.groupBy === 'month') {
    const [y, m] = key.split('-')
    const months = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des']
    return `${months[parseInt(m) - 1]} ${y}`
  }
  if (props.groupBy === 'week') return `Mg. ${formatTanggalPendek(key)}`
  return formatTanggalPendek(key)
}

const bars = computed(() => {
  const map = {}
  for (const t of props.transactions) {
    const k = getKey(t)
    if (!map[k]) map[k] = 0
    map[k] += t.total
  }
  return Object.entries(map)
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([k, v]) => ({ label: formatKey(k), value: v, key: k }))
})

</script>

<template>
  <div class="trend-wrap">
    <div v-if="bars.length === 0" class="empty">Tidak ada data dalam rentang ini.</div>
    <div v-else class="trend-bars">
      <div v-for="bar in bars" :key="bar.key" class="trend-bar-item">
        <div class="bar-col">
          <div class="bar-track">
            <div
              class="bar-fill"
              :style="{ height: (bar.value / Math.max(...bars.map(b=>b.value)) * 100) + '%' }"
            ></div>
          </div>
        </div>
        <div class="bar-label">{{ bar.label }}</div>
        <div class="bar-val">{{ formatRupiah(bar.value) }}</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.trend-wrap {
  overflow-x: auto;
  background: var(--color-surface);
  border: 1px solid rgba(0, 0, 0, 0.05);
  border-radius: var(--radius-card);
  padding: 20px;
  box-shadow: var(--shadow-sm);
}
.empty { color: #9CA3AF; font-size: 13px; padding: 20px 0; }
.trend-bars {
  display: flex;
  align-items: flex-end;
  gap: 12px;
  min-height: 160px;
  padding: 8px 0 0;
}
.trend-bar-item {
  display: flex; flex-direction: column; align-items: center; gap: 6px;
  flex: 1; min-width: 52px;
}
.bar-col { flex: 1; display: flex; align-items: flex-end; height: 120px; width: 100%; }
.bar-track { width: 100%; height: 100%; display: flex; align-items: flex-end; background: #F3F4F6; border-radius: 6px 6px 0 0; overflow: hidden; }
.bar-fill {
  width: 100%;
  background: var(--color-primary);
  border-radius: 6px 6px 0 0;
  min-height: 4px;
  transition: height 0.3s ease;
}
.bar-label { font-size: 11px; color: #6B7280; text-align: center; white-space: nowrap; font-weight: 500; }
.bar-val { font-size: 11px; font-weight: 600; color: var(--color-secondary); text-align: center; white-space: nowrap; }
</style>
