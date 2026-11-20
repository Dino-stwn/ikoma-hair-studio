<script setup>
defineProps({
  show:    { type: Boolean, default: false },
  message: { type: String,  default: 'Apakah Anda yakin?' }
})
defineEmits(['confirm', 'cancel'])
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="show" class="overlay" @click.self="$emit('cancel')">
        <div class="dialog" role="alertdialog" aria-modal="true">
          <p class="dialog__icon">⚠️</p>
          <p class="dialog__message">{{ message }}</p>
          <div class="dialog__actions">
            <button class="btn btn-ghost" @click="$emit('cancel')">Batal</button>
            <button class="btn btn-danger" @click="$emit('confirm')">Ya, Lanjutkan</button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(17, 24, 39, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 16px;
  backdrop-filter: blur(2px);
}

.dialog {
  background: var(--color-surface);
  border-radius: var(--radius-modal);
  padding: 36px 32px;
  width: 100%;
  max-width: 380px;
  text-align: center;
  box-shadow: var(--shadow-lg);
}

.dialog__icon { font-size: 40px; margin-bottom: 14px; }

.dialog__message {
  font-size: var(--text-body);
  color: var(--color-text);
  line-height: 1.65;
  margin-bottom: 28px;
}

.dialog__actions {
  display: flex;
  gap: 12px;
  justify-content: center;
}

/* Transisi */
.modal-enter-active { transition: opacity var(--transition-base); }
.modal-leave-active { transition: opacity var(--transition-fast); }
.modal-enter-from, .modal-leave-to { opacity: 0; }
.modal-enter-active .dialog { transition: transform var(--transition-base); }
.modal-leave-active .dialog { transition: transform var(--transition-fast); }
.modal-enter-from .dialog { transform: scale(0.95) translateY(-10px); }
.modal-leave-to .dialog   { transform: scale(0.97); }
</style>
