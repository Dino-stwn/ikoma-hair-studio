<script setup>
import { ref, watch } from 'vue'
import BaseModal  from '@/components/common/BaseModal.vue'
import BaseInput  from '@/components/common/BaseInput.vue'
import BaseButton from '@/components/common/BaseButton.vue'
import { useServicesStore } from '@/stores/services'

const props = defineProps({
  show:        { type: Boolean, default: false },
  /** null = mode tambah; objek service = mode ubah */
  editTarget:  { type: Object,  default: null }
})
const emit = defineEmits(['close', 'saved'])

const store = useServicesStore()

// ── State form ────────────────────────────────────────────────────────────────
const name   = ref('')
const price  = ref('')
const errors = ref({ name: '', price: '' })
const isEdit = ref(false)
const modalTitle = ref('Tambah Layanan')

// Isi form saat modal dibuka / editTarget berubah
watch(
  () => props.show,
  (val) => {
    if (!val) return
    if (props.editTarget) {
      isEdit.value     = true
      modalTitle.value = 'Ubah Layanan'
      name.value       = props.editTarget.name
      price.value      = String(props.editTarget.price)
    } else {
      isEdit.value     = false
      modalTitle.value = 'Tambah Layanan'
      name.value       = ''
      price.value      = ''
    }
    errors.value = { name: '', price: '' }
  },
  { immediate: true }
)

// ── Validasi ──────────────────────────────────────────────────────────────────
function validate() {
  const e = { name: '', price: '' }

  const trimName = name.value.trim()
  if (!trimName) {
    e.name = 'Nama layanan wajib diisi.'
  } else {
    const excludeId = isEdit.value ? props.editTarget.id : null
    if (store.isNameTaken(trimName, excludeId)) {
      e.name = 'Nama layanan sudah digunakan.'
    }
  }

  const priceNum = Number(price.value)
  if (!price.value.toString().trim()) {
    e.price = 'Harga wajib diisi.'
  } else if (!Number.isInteger(priceNum) || priceNum <= 0) {
    e.price = 'Harga harus bilangan bulat lebih dari 0.'
  }

  errors.value = e
  return !e.name && !e.price
}

// ── Submit ────────────────────────────────────────────────────────────────────
function handleSubmit() {
  if (!validate()) return

  const payload = { name: name.value.trim(), price: Number(price.value) }
  const result  = isEdit.value
    ? store.update(props.editTarget.id, payload)
    : store.add(payload)

  if (result && !result.ok) {
    errors.value.name = result.message
    return
  }

  emit('saved', isEdit.value ? 'ubah' : 'tambah')
  emit('close')
}
</script>

<template>
  <BaseModal :show="show" :title="modalTitle" @close="$emit('close')">
    <form id="service-form" novalidate @submit.prevent="handleSubmit">
      <BaseInput
        v-model="name"
        label="Nama Layanan"
        placeholder="cth. Hair Cut + Hair Wash"
        :error="errors.name"
        class="mb-field"
      />
      <BaseInput
        v-model="price"
        label="Harga (Rp)"
        type="number"
        placeholder="cth. 45000"
        :error="errors.price"
        class="mb-field"
      />
    </form>

    <template #footer>
      <BaseButton label="Batal"  variant="secondary" @click="$emit('close')" />
      <BaseButton
        :label="isEdit ? 'Simpan Perubahan' : 'Tambah'"
        variant="primary"
        type="submit"
        form="service-form"
      />
    </template>
  </BaseModal>
</template>

<style scoped>
.mb-field { margin-bottom: 16px; }
</style>
