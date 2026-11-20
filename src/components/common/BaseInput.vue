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
    <label v-if="label" class="field__label label">{{ label }}</label>
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
.field { display: flex; flex-direction: column; gap: 4px; }
.field__label { margin-bottom: 2px; }
.form-control--error { border-color: var(--color-danger); }
.field__error {
  font-size: var(--text-label);
  color: var(--color-danger);
  margin-top: 2px;
}
</style>
