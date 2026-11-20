<script setup>
import { ref, watch } from 'vue'
import BaseModal  from '@/components/common/BaseModal.vue'
import BaseInput  from '@/components/common/BaseInput.vue'
import BaseButton from '@/components/common/BaseButton.vue'

const props = defineProps({
  show:    { type: Boolean, default: false },
  product: { type: Object,  default: null }
})
const emit = defineEmits(['close', 'confirm'])

const delta  = ref('')
const error  = ref('')

watch(
  () => props.show,
  (val) => { if (val) { delta.value = ''; error.value = '' } }
)

function validate() {
  const n = Number(delta.value)
  if (delta.value.toString().trim() === '') {
    error.value = 'Jumlah wajib diisi.'; return false
  }
  if (!Number.isInteger(n) || n <= 0) {
    error.value = 'Jumlah harus bilangan bulat lebih dari 0.'; return false
  }
  error.value = ''
  return true
}

function handleSubmit() {
  if (!validate()) return
  emit('confirm', Number(delta.value))
  emit('close')
}
</script>

<template>
  <BaseModal
    :show="show"
    :title="`Tambah Stok — ${product?.name ?? ''}`"
    @close="$emit('close')"
  >
    <p class="restock-info">
      <span>Stok sekarang:</span><strong>{{ product?.stock ?? 0 }}</strong>
    </p>

    <form id="restock-form" novalidate @submit.prevent="handleSubmit">
      <BaseInput
        v-model="delta"
        label="Jumlah Tambah"
        type="number"
        placeholder="cth. 10"
        :error="error"
      />
    </form>

    <template #footer>
      <BaseButton label="Batal" variant="secondary" @click="$emit('close')" />
      <BaseButton
        label="Tambah Stok"
        variant="success"
        type="submit"
        form="restock-form"
      />
    </template>
  </BaseModal>
</template>

<style scoped>
.restock-info {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
  padding: 12px 16px;
  background: #F9FAFB;
  border: 1px solid #F3F4F6;
  border-radius: 10px;
  font-size: var(--text-body);
  color: #374151;
}
.restock-info strong {
  font-family: var(--font-heading);
  font-size: 20px;
  font-weight: 700;
  color: var(--color-secondary);
  margin-left: 4px;
}
</style>
