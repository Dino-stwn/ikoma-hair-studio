<script setup>
// variant: success | warning | danger | neutral
defineProps({
  text:    { type: String, default: '' },
  variant: { type: String, default: 'neutral' }
})
</script>

<template>
  <span :class="['badge', `badge-${variant}`]">{{ text }}</span>
</template>

<style scoped>
/* Variabel warna badge sudah didefinisikan di main.css (.badge-success dst.) */
.badge-neutral {
  background-color: #F3F4F6;
  color: #6B7280;
}
</style>
