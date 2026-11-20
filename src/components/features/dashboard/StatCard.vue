<script setup>
defineProps({
  title: { type: String, default: '' },
  value: { type: [String, Number], default: '' },
  hint:  { type: String, default: '' }
})
</script>

<template>
  <div class="stat-card card">
    <p class="stat-card__title label">{{ title }}</p>
    <p class="stat-card__value">{{ value }}</p>
    <p v-if="hint" class="stat-card__hint">{{ hint }}</p>
  </div>
</template>

<style scoped>
.stat-card { display: flex; flex-direction: column; gap: 6px; }

.stat-card__title {
  color: #6B7280;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.stat-card__value {
  font-family: var(--font-heading);
  font-size: 28px;
  font-weight: 700;
  color: var(--color-secondary);
  line-height: 1.1;
}

.stat-card__hint {
  font-size: var(--text-label);
  color: #9CA3AF;
}
</style>
