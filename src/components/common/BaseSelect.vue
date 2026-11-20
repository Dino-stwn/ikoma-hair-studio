<script setup>
defineProps({
  modelValue: { type: [String, Number], default: '' },
  label:      { type: String, default: '' },
  options:    { type: Array,  default: () => [] }, // [{ value, label }]
  error:      { type: String, default: '' }
})
defineEmits(['update:modelValue'])
</script>

<template>
  <div class="field">
    <label v-if="label" class="field__label label">{{ label }}</label>
    <select
      :value="modelValue"
      :class="['form-control', { 'form-control--error': error }]"
      @change="$emit('update:modelValue', $event.target.value)"
    >
      <option
        v-for="opt in options"
        :key="opt.value"
        :value="opt.value"
      >{{ opt.label }}</option>
    </select>
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
