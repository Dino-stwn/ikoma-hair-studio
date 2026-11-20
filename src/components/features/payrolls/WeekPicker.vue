<script setup>
import { ref, computed, watch } from 'vue'
import BaseInput from '@/components/common/BaseInput.vue'
import { formatTanggalPendek } from '@/utils/format'

const emit = defineEmits(['change'])

const rawDate = ref('')   // nilai <input type="date">

/** Hitung Senin dari tanggal manapun */
function getMondayISO(iso) {
  if (!iso) return ''
  const d = new Date(iso + 'T00:00:00')
  const day = d.getDay()                   // 0=Min, 1=Sen … 6=Sab
  const diff = day === 0 ? -6 : 1 - day   // geser ke Senin
  d.setDate(d.getDate() + diff)
  return d.toISOString().split('T')[0]
}

const weekStart = computed(() => getMondayISO(rawDate.value))
const weekEnd   = computed(() => {
  if (!weekStart.value) return ''
  const d = new Date(weekStart.value + 'T00:00:00')
  d.setDate(d.getDate() + 6)
  return d.toISOString().split('T')[0]
})

const rangeLabel = computed(() => {
  if (!weekStart.value) return 'Belum dipilih'
  return `${formatTanggalPendek(weekStart.value)}  –  ${formatTanggalPendek(weekEnd.value)}`
})

watch([weekStart, weekEnd], ([s, e]) => {
  if (s && e) emit('change', { weekStart: s, weekEnd: e })
})
</script>

<template>
  <div class="week-picker card">
    <div class="picker-row">
      <BaseInput
        v-model="rawDate"
        label="Pilih tanggal dalam minggu"
        type="date"
        class="date-input"
      />
      <div class="range-display">
        <p class="label">Periode Minggu</p>
        <p class="range-val">{{ rangeLabel }}</p>
      </div>
    </div>
    <p class="picker-hint">
      Pilih tanggal mana saja — sistem akan otomatis memilih Senin s.d. Minggu dari minggu tersebut.
    </p>
  </div>
</template>

<style scoped>
.week-picker { margin-bottom: 20px; }

.picker-row {
  display: flex;
  align-items: flex-end;
  gap: 20px;
  flex-wrap: wrap;
}

.date-input { min-width: 200px; }

.range-display {
  flex: 1;
  min-width: 220px;
  background: var(--color-primary-tint);
  border: 1px solid rgba(201, 162, 39, 0.2);
  border-radius: var(--radius-btn);
  padding: 10px 16px;
}

.range-val {
  font-family: var(--font-heading);
  font-size: var(--text-subheading);
  font-weight: 600;
  color: var(--color-secondary);
  margin-top: 2px;
}

.picker-hint {
  font-size: var(--text-label);
  color: #9CA3AF;
  margin-top: 12px;
}
</style>
