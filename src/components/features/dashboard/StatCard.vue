<script setup>
defineProps({
  title:   { type: String, default: '' },
  value:   { type: [String, Number], default: '' },
  hint:    { type: String, default: '' },
  variant: { type: String, default: 'default' } // default | success | warning | danger
})
</script>

<template>
  <div class="stat-card card">
    <div class="stat-card__header">
      <p class="stat-card__title">{{ title }}</p>
    </div>
    <p class="stat-card__value">{{ value }}</p>
    <p v-if="hint" class="stat-card__hint">{{ hint }}</p>
  </div>
</template>

<style scoped>
.stat-card {
  display: flex;
  flex-direction: column;
  gap: 8px;
  transition: box-shadow var(--transition-base), transform var(--transition-base);
}

.stat-card:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}

.stat-card__header { margin-bottom: 2px; }

.stat-card__icon-wrap {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 42px;
  height: 42px;
  border-radius: 10px;
  font-size: 20px;
  background-color: var(--color-primary-tint);
}

.icon-wrap--success { background-color: var(--color-success-tint); }
.icon-wrap--warning { background-color: var(--color-warning-tint); }
.icon-wrap--danger  { background-color: var(--color-danger-tint); }

.stat-card__title {
  font-size: var(--text-label);
  font-weight: 600;
  color: #6B7280;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.stat-card__value {
  font-family: var(--font-heading);
  font-size: 26px;
  font-weight: 700;
  color: var(--color-secondary);
  line-height: 1.1;
}

.stat-card__hint {
  font-size: var(--text-label);
  color: #9CA3AF;
}
</style>
