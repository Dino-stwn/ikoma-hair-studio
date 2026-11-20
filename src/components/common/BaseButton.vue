<script setup>
defineProps({
  label:    { type: String,  default: '' },
  variant:  { type: String,  default: 'primary' },   // primary | secondary | danger | ghost | success
  disabled: { type: Boolean, default: false },
  type:     { type: String,  default: 'button' }
})
defineEmits(['click'])
</script>

<template>
  <button
    :type="type"
    :disabled="disabled"
    :class="['btn', `btn-${variant}`]"
    @click="$emit('click', $event)"
  >
    <slot>{{ label }}</slot>
  </button>
</template>

<style scoped>
button { letter-spacing: 0.01em; }
</style>
