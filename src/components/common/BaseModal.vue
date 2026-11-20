<script setup>
defineProps({
  show:  { type: Boolean, default: false },
  title: { type: String,  default: '' }
})
defineEmits(['close'])
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="show" class="modal-overlay" @click.self="$emit('close')">
        <div class="modal-box" role="dialog" aria-modal="true">
          <!-- Header -->
          <div class="modal-header">
            <h2 class="modal-title">{{ title }}</h2>
            <button class="modal-close" aria-label="Tutup" @click="$emit('close')">✕</button>
          </div>

          <!-- Konten (slot default) -->
          <div class="modal-body">
            <slot />
          </div>

          <!-- Footer opsional -->
          <div v-if="$slots.footer" class="modal-footer">
            <slot name="footer" />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(17, 24, 39, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
  padding: 16px;
  backdrop-filter: blur(2px);
}

.modal-box {
  background: var(--color-surface);
  border-radius: var(--radius-modal);
  width: 100%;
  max-width: 540px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  box-shadow: var(--shadow-lg);
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  border-bottom: 1px solid #F3F4F6;
  flex-shrink: 0;
}

.modal-title {
  font-size: var(--text-subheading);
  font-family: var(--font-heading);
  font-weight: 600;
  color: var(--color-text);
}

.modal-close {
  background: #F3F4F6;
  border: none;
  font-size: 13px;
  cursor: pointer;
  color: #6B7280;
  line-height: 1;
  padding: 7px 9px;
  border-radius: 7px;
  transition: background var(--transition-fast), color var(--transition-fast);
}

.modal-close:hover {
  background: #E5E7EB;
  color: var(--color-text);
}

.modal-body {
  padding: 24px;
  overflow-y: auto;
  flex: 1;
}

.modal-footer {
  padding: 16px 24px;
  border-top: 1px solid #F3F4F6;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  flex-shrink: 0;
}

/* Transisi masuk lembut */
.modal-enter-active {
  transition: opacity var(--transition-base);
}
.modal-leave-active {
  transition: opacity var(--transition-fast);
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
.modal-enter-active .modal-box {
  transition: transform var(--transition-base), opacity var(--transition-base);
}
.modal-leave-active .modal-box {
  transition: transform var(--transition-fast);
}
.modal-enter-from .modal-box {
  transform: scale(0.96) translateY(-12px);
  opacity: 0;
}
.modal-leave-to .modal-box {
  transform: scale(0.97) translateY(-6px);
}
</style>
