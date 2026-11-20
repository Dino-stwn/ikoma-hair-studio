<script setup>
import { ref, watch } from 'vue'
import BaseModal  from '@/components/common/BaseModal.vue'
import BaseInput  from '@/components/common/BaseInput.vue'
import BaseSelect from '@/components/common/BaseSelect.vue'
import BaseButton from '@/components/common/BaseButton.vue'

const props = defineProps({
  show:       { type: Boolean, default: false },
  editTarget: { type: Object,  default: null }
})
const emit = defineEmits(['close', 'saved'])

const typeOptions = [{ value: 'gel', label: 'Gel' }, { value: 'powder', label: 'Powder' }]

const name       = ref('')
const type       = ref('gel')
const price      = ref('')
const stock      = ref('')
const minStock   = ref('')
const errors     = ref({ name: '', price: '', stock: '', minStock: '' })
const isEdit     = ref(false)
const modalTitle = ref('Tambah Produk')

watch(() => props.show, (val) => {
  if (!val) return
  errors.value = { name: '', price: '', stock: '', minStock: '' }
  if (props.editTarget) {
    isEdit.value = true; modalTitle.value = 'Ubah Produk'; name.value = props.editTarget.name
    type.value = props.editTarget.type; price.value = String(props.editTarget.price)
    stock.value = String(props.editTarget.stock); minStock.value = String(props.editTarget.min_stock)
  } else {
    isEdit.value = false; modalTitle.value = 'Tambah Produk'; name.value = ''
    type.value = 'gel'; price.value = ''; stock.value = ''; minStock.value = ''
  }
}, { immediate: true })

function validate() {
  const e = { name: '', price: '', stock: '', minStock: '' }
  if (!name.value.trim()) e.name = 'Nama produk wajib diisi.'
  const priceNum = Number(price.value)
  if (price.value.toString().trim() === '') e.price = 'Harga wajib diisi.'
  else if (!Number.isInteger(priceNum) || priceNum <= 0) e.price = 'Harga harus bilangan bulat lebih dari 0.'
  const stockNum = Number(stock.value)
  if (stock.value.toString().trim() === '') e.stock = 'Stok wajib diisi (boleh 0).'
  else if (!Number.isInteger(stockNum) || stockNum < 0) e.stock = 'Stok harus bilangan bulat tidak negatif.'
  const minNum = Number(minStock.value)
  if (minStock.value.toString().trim() === '') e.minStock = 'Stok minimum wajib diisi.'
  else if (!Number.isInteger(minNum) || minNum < 0) e.minStock = 'Stok minimum harus bilangan bulat tidak negatif.'
  errors.value = e
  return !e.name && !e.price && !e.stock && !e.minStock
}

function handleSubmit() {
  if (!validate()) return
  emit('saved', {
    mode: isEdit.value ? 'ubah' : 'tambah',
    data: { name: name.value.trim(), type: type.value, price: Number(price.value), stock: Number(stock.value), min_stock: Number(minStock.value) }
  })
  emit('close')
}
</script>

<template>
  <BaseModal :show="show" :title="modalTitle" @close="$emit('close')">
    <form id="product-form" novalidate @submit.prevent="handleSubmit">
      <BaseInput v-model="name" label="Nama Produk" placeholder="cth. Minyak Rambut Gel" :error="errors.name" class="mb-field" />
      <BaseSelect v-model="type" label="Jenis" :options="typeOptions" class="mb-field" />
      <BaseInput v-model="price" label="Harga (Rp)" type="number" placeholder="cth. 30000" :error="errors.price" class="mb-field" />
      <div class="row-2">
        <BaseInput v-model="stock" label="Stok Saat Ini" type="number" placeholder="0" :error="errors.stock" />
        <BaseInput v-model="minStock" label="Stok Minimum" type="number" placeholder="3" :error="errors.minStock" />
      </div>
    </form>
    <template #footer>
      <BaseButton label="Batal" variant="secondary" @click="$emit('close')" />
      <BaseButton :label="isEdit ? 'Simpan Perubahan' : 'Tambah'" variant="primary" type="submit" form="product-form" />
    </template>
  </BaseModal>
</template>

<style scoped>
.mb-field { margin-bottom: 18px; }
.row-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 4px; }
@media (max-width: 400px) { .row-2 { grid-template-columns: 1fr; } }
</style>
