<script setup>
/**
 * PayrollSavePanel.vue — Form potongan + tombol simpan rekap gaji.
 * Dipisah dari PayrollCalculation agar masing-masing komponen < 150 baris.
 */
import { ref } from 'vue'
import BaseInput   from '@/components/common/BaseInput.vue'
import BaseButton  from '@/components/common/BaseButton.vue'

const props = defineProps({
  totalRevenue: { type: Number, default: 0 },
  weekStart:    { type: String, default: '' },
  weekEnd:      { type: String, default: '' }
})
const emit = defineEmits(['save'])

const deduction    = ref('0')
const deductionErr = ref('')

function validate() {
  const n = Number(deduction.value)
  if (deduction.value.toString().trim() === '') {
    deductionErr.value = 'Potongan wajib diisi (boleh 0).'; return false
  }
  if (!Number.isInteger(n) || n < 0) {
    deductionErr.value = 'Potongan harus bilangan bulat tidak negatif.'; return false
  }
  if (n > props.totalRevenue) {
    deductionErr.value = 'Potongan tidak boleh melebihi total pendapatan.'; return false
  }
  deductionErr.value = ''
  return true
}

function handleSave() {
  if (!validate()) return
  emit('save', Number(deduction.value))
}

// Reset potongan saat minggu berubah
function reset() { deduction.value = '0'; deductionErr.value = '' }
defineExpose({ reset })
</script>

<template>
  <div class="deduction-row">
    <BaseInput
      v-model="deduction"
      label="Potongan Operasional (Rp)"
      type="number"
      placeholder="0"
      :error="deductionErr"
      class="deduction-input"
    />
    <BaseButton label="💾 Simpan Rekap" variant="primary" class="save-btn" @click="handleSave" />
  </div>
</template>

<style scoped>
.deduction-row   { display: flex; align-items: flex-end; gap: 16px; flex-wrap: wrap; margin-top: 18px; padding-top: 16px; border-top: 1px solid #F3F4F6; }
.deduction-input { flex: 1; min-width: 220px; }
.save-btn        { flex-shrink: 0; margin-bottom: 2px; }
</style>
