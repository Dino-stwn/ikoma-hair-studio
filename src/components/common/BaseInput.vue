<script setup>
defineProps({
  modelValue:  { type: [String, Number], default: '' },
  label:       { type: String, default: '' },
  type:        { type: String, default: 'text' },
  placeholder: { type: String, default: '' },
  error:       { type: String, default: '' }
})
defineEmits(['update:modelValue'])
</script>

<template>
  <div class="field">
    <label v-if="label" class="field__label">{{ label }}</label>
    <input
      :type="type"
      :value="modelValue"
      :placeholder="placeholder"
      :class="['form-control', { 'form-control--error': error }]"
      @input="$emit('update:modelValue', $event.target.value)"
    />
    <span v-if="error" class="field__error">{{ error }}</span>
  </div>
</template>

<style scoped>
.field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.field__label {
  font-size: var(--text-label);
  font-weight: 600;
  color: #374151;
  letter-spacing: 0.3px;
}

.form-control--error {
  border-color: var(--color-danger) !important;
  box-shadow: 0 0 0 3px var(--color-danger-tint) !important;
}

.field__error {
  font-size: 11px;
  color: var(--color-danger);
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 4px;
}

.field__error::before {
  content: '⚠';
  font-size: 10px;
}
</style>
