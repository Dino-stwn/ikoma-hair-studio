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
  padding: 12px 16px;
  border-radius: 8px;
  font-size: var(--text-body);
  margin-bottom: 16px;
  border-left-width: 4px;
  border-left-style: solid;
}

.alert-msg--success {
  background-color: #DCFCE7;
  color: #14532D;
  border-left-color: var(--color-success);
}

.alert-msg--error {
  background-color: #FEE2E2;
  color: #7F1D1D;
  border-left-color: var(--color-danger);
}

.alert-msg--warning {
  background-color: #FEF3C7;
  color: #78350F;
  border-left-color: var(--color-warning);
}

.alert-msg__text { flex: 1; }

.alert-msg__close {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 14px;
  opacity: 0.6;
  padding: 0 4px;
  line-height: 1;
  transition: opacity 0.15s;
}

.alert-msg__close:hover { opacity: 1; }

/* Transisi */
.alert-slide-enter-active, .alert-slide-leave-active {
  transition: opacity 0.25s, transform 0.25s;
}
.alert-slide-enter-from, .alert-slide-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}
</style>
