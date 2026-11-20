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
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 16px;
}

.dialog {
  background: var(--color-surface);
  border-radius: 10px;
  padding: 32px 28px;
  width: 100%;
  max-width: 380px;
  text-align: center;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.18);
}

.dialog__icon { font-size: 36px; margin-bottom: 12px; }

.dialog__message {
  font-size: var(--text-body);
  color: var(--color-text);
  line-height: 1.6;
  margin-bottom: 24px;
}

.dialog__actions {
  display: flex;
  gap: 10px;
  justify-content: center;
}

/* Transisi sama seperti BaseModal */
.modal-enter-active, .modal-leave-active { transition: opacity 0.2s; }
.modal-enter-from, .modal-leave-to { opacity: 0; }
.modal-enter-active .dialog,
.modal-leave-active .dialog { transition: transform 0.2s; }
.modal-enter-from .dialog,
.modal-leave-to .dialog { transform: scale(0.95); }
</style>
