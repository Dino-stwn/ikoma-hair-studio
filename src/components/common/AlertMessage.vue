<script setup>
// type: success | error | warning
defineProps({
  type:    { type: String, default: 'success' },
  message: { type: String, default: '' }
})
defineEmits(['close'])

const iconMap = { success: '✅', error: '❌', warning: '⚠️' }
</script>

<template>
  <Transition name="alert-slide">
    <div v-if="message" :class="['alert-msg', `alert-msg--${type}`]" role="alert">
      <span class="alert-msg__icon">{{ iconMap[type] }}</span>
      <span class="alert-msg__text">{{ message }}</span>
      <button class="alert-msg__close" aria-label="Tutup" @click="$emit('close')">✕</button>
    </div>
  </Transition>
</template>

<style scoped>
.alert-msg {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 13px 16px;
  border-radius: 10px;
  font-size: var(--text-body);
  margin-bottom: 16px;
  border-left-width: 4px;
  border-left-style: solid;
  border: 1px solid transparent;
  border-left-width: 4px;
}

.alert-msg--success {
  background-color: rgba(22, 163, 74, 0.08);
  color: #14532D;
  border-color: rgba(22, 163, 74, 0.2);
  border-left-color: var(--color-success);
}

.alert-msg--error {
  background-color: rgba(220, 38, 38, 0.08);
  color: #7F1D1D;
  border-color: rgba(220, 38, 38, 0.2);
  border-left-color: var(--color-danger);
}

.alert-msg--warning {
  background-color: rgba(245, 158, 11, 0.08);
  color: #78350F;
  border-color: rgba(245, 158, 11, 0.2);
  border-left-color: var(--color-warning);
}

.alert-msg__icon {
  font-size: 16px;
  flex-shrink: 0;
}

.alert-msg__text { flex: 1; }

.alert-msg__close {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 14px;
  opacity: 0.5;
  padding: 0 4px;
  line-height: 1;
  transition: opacity var(--transition-fast);
  flex-shrink: 0;
}

.alert-msg__close:hover { opacity: 1; }

/* Transisi */
.alert-slide-enter-active,
.alert-slide-leave-active {
  transition: opacity 0.25s, transform 0.25s;
}
.alert-slide-enter-from,
.alert-slide-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}
</style>
