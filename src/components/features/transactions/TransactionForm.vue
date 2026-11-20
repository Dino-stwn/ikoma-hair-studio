<script setup>
import { ref, computed, watch } from 'vue'
import BaseSelect from '@/components/common/BaseSelect.vue'
import BaseInput  from '@/components/common/BaseInput.vue'
import BaseButton from '@/components/common/BaseButton.vue'
import { useServicesStore } from '@/stores/services'
import { useProductsStore }  from '@/stores/products'
import { formatRupiah }      from '@/utils/format'

const props = defineProps({
  /** Keranjang saat ini — dipakai untuk hitung stok efektif produk */
  cart: { type: Array, default: () => [] }
})
const emit = defineEmits(['add-item'])

const svcStore = useServicesStore()
const prdStore = useProductsStore()

// ── Form state ────────────────────────────────────────────────────────────────
const itemType   = ref('service')
const selectedId = ref('')
const qty        = ref('1')
const unitPrice  = ref('')
const note       = ref('')
const errors     = ref({})

const itemTypeOptions = [
  { value: 'service', label: 'Layanan' },
  { value: 'product', label: 'Produk'  }
]

// Stok efektif tiap produk = store.stock - qty di keranjang saat ini
const effectiveStocks = computed(() => {
  return prdStore.products.reduce((acc, p) => {
    const inCart = props.cart
      .filter((i) => i.item_type === 'product' && i.product_id === p.id)
      .reduce((s, i) => s + i.qty, 0)
    acc[p.id] = p.stock - inCart
    return acc
  }, {})
})

// Opsi dropdown sesuai jenis item
const itemOptions = computed(() => {
  const empty = [{ value: '', label: '— Pilih —' }]
  if (itemType.value === 'service') {
    return [
      ...empty,
      ...svcStore.activeServices.map((s) => ({
        value: s.id,
        label: `${s.name} — ${formatRupiah(s.price)}`
      }))
    ]
  }
  return [
    ...empty,
    ...prdStore.products
      .filter((p) => (effectiveStocks.value[p.id] ?? 0) > 0)
      .map((p) => ({
        value: p.id,
        label: `${p.name} — Stok: ${effectiveStocks.value[p.id]} (${formatRupiah(p.price)})`
      }))
  ]
})

// Harga master dari item yang dipilih
const masterPrice = computed(() => {
  if (!selectedId.value) return 0
  return itemType.value === 'service'
    ? (svcStore.getById(selectedId.value)?.price ?? 0)
    : (prdStore.getById(selectedId.value)?.price ?? 0)
})

const isPriceModified = computed(() =>
  selectedId.value && Number(unitPrice.value) !== masterPrice.value
)

// Reset saat jenis item berganti
watch(itemType, () => { selectedId.value = ''; unitPrice.value = ''; note.value = ''; errors.value = {} })

// Isi harga saat item dipilih
watch(selectedId, (id) => {
  errors.value = {}
  unitPrice.value = id ? String(masterPrice.value) : ''
})

// ── Validasi & tambah ─────────────────────────────────────────────────────────
function validate() {
  const e = {}
  if (!selectedId.value) { e.selectedId = 'Pilih layanan atau produk.' }

  const q = Number(qty.value)
  if (!Number.isInteger(q) || q < 1) {
    e.qty = 'Jumlah harus bilangan bulat minimal 1.'
  } else if (itemType.value === 'product' && selectedId.value) {
    const effStock = effectiveStocks.value[selectedId.value] ?? 0
    if (q > effStock) e.qty = `Stok produk tidak mencukupi (tersisa ${effStock}).`
  }

  const p = Number(unitPrice.value)
  if (!unitPrice.value || !Number.isInteger(p) || p <= 0) {
    e.unitPrice = 'Harga satuan harus bilangan bulat lebih dari 0.'
  }

  if (isPriceModified.value && !note.value.trim()) {
    e.note = 'Catatan wajib diisi jika harga berbeda dari harga master.'
  }

  errors.value = e
  return Object.keys(e).length === 0
}

function handleAdd() {
  if (!validate()) return

  const isService = itemType.value === 'service'
  const selected  = isService
    ? svcStore.getById(selectedId.value)
    : prdStore.getById(selectedId.value)

  const qNum = Number(qty.value)
  const pNum = Number(unitPrice.value)

  emit('add-item', {
    item_type:    itemType.value,
    service_id:   isService ? selectedId.value : null,
    product_id:   isService ? null : selectedId.value,
    name:         selected.name,
    qty:          qNum,
    master_price: masterPrice.value,
    unit_price:   pNum,
    subtotal:     qNum * pNum,
    note:         note.value.trim()
  })

  // Reset hanya pilihan item — pertahankan jenis
  selectedId.value = ''; qty.value = '1'; unitPrice.value = ''; note.value = ''; errors.value = {}
}
</script>

<template>
  <div class="item-form">
    <h2 class="form-title">Tambah Item</h2>

    <BaseSelect v-model="itemType" label="Jenis Item" :options="itemTypeOptions" class="mb-f" />
    <BaseSelect v-model="selectedId" label="Layanan / Produk" :options="itemOptions"
      :error="errors.selectedId" class="mb-f" />

    <div class="row-2">
      <BaseInput v-model="qty" label="Jumlah" type="number" placeholder="1"
        :error="errors.qty" />
      <BaseInput v-model="unitPrice" label="Harga Satuan (Rp)" type="number"
        :placeholder="String(masterPrice || 0)" :error="errors.unitPrice" />
    </div>

    <p v-if="isPriceModified" class="price-hint">
      ⚠️ Harga master: {{ formatRupiah(masterPrice) }}
    </p>

    <BaseInput v-model="note" label="Catatan Item" placeholder="Opsional; wajib jika harga diubah"
      :error="errors.note" class="mb-f mt-f" />

    <BaseButton label="+ Tambah ke Keranjang" variant="primary" class="btn-full" @click="handleAdd" />
  </div>
</template>

<style scoped>
.item-form   { display: flex; flex-direction: column; }
.form-title  { font-size: var(--text-subheading); margin-bottom: 16px; }
.mb-f        { margin-bottom: 14px; }
.mt-f        { margin-top: 2px; }
.row-2       { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 6px; }
.price-hint  { font-size: var(--text-label); color: var(--color-warning); margin: 4px 0 6px; }
.btn-full    { width: 100%; justify-content: center; margin-top: 8px; }
</style>
