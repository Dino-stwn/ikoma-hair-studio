<script setup>
// variant: success | warning | danger | info | neutral | primary
defineProps({
  text:    { type: String, default: '' },
  variant: { type: String, default: 'neutral' }
})
</script>

<template>
  <span :class="['badge', `badge-${variant}`]">{{ text }}</span>
</template>

<style scoped>
.badge {
  display: inline-block;
  padding: 3px 10px;
  border-radius: var(--radius-pill);
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.3px;
}

.badge-neutral { background-color: #F3F4F6; color: #4B5563; }
.badge-primary { background-color: var(--color-primary-tint); color: #92680A; }

/* Tint lembut untuk status */
.badge-success { background-color: rgba(22,163,74,0.12); color: #15803D; }
.badge-warning { background-color: rgba(245,158,11,0.12); color: #B45309; }
.badge-danger  { background-color: rgba(220,38,38,0.12);  color: #B91C1C; }
.badge-info    { background-color: rgba(59,130,246,0.12); color: #1D4ED8; }
</style>
