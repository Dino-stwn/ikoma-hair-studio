<script setup>
import { ref, watch } from 'vue'
import BaseModal  from '@/components/common/BaseModal.vue'
import BaseSelect from '@/components/common/BaseSelect.vue'
import BaseButton from '@/components/common/BaseButton.vue'
import { formatRupiah, formatTanggalPendek } from '@/utils/format'
import { PAYMENT_OPTIONS } from '@/utils/constants'

const props = defineProps({
  show:        { type: Boolean, default: false },
  transaction: { type: Object,  default: null  }
})
const emit = defineEmits(['close', 'saved'])

const paymentMethod = ref('tunai')
const note          = ref('')

watch(
  () => props.show,
  (val) => {
    if (val && props.transaction) {
      paymentMethod.value = props.transaction.payment_method
      note.value          = props.transaction.note ?? ''
    }
  }
)

function handleSubmit() {
  emit('saved', { payment_method: paymentMethod.value, note: note.value.trim() })
  emit('close')
}
</script>

<template>
  <BaseModal :show="show" title="Ubah Transaksi" @close="$emit('close')">
    <!-- Info read-only -->
    <div class="trx-info">
      <div class="info-row"><span class="label">Kode</span><span>{{ transaction?.code }}</span></div>
      <div class="info-row"><span class="label">Tanggal</span><span>{{ formatTanggalPendek(transaction?.trx_date) }}</span></div>
      <div class="info-row"><span class="label">Total</span><span class="total-val">{{ formatRupiah(transaction?.total) }}</span></div>
    </div>

    <hr class="divider" />

    <form id="edit-trx-form" novalidate @submit.prevent="handleSubmit">
      <BaseSelect
        v-model="paymentMethod"
        label="Metode Pembayaran"
        :options="PAYMENT_OPTIONS"
        class="mb-f"
      />
      <div class="form-group">
        <label class="label">Catatan</label>
        <textarea v-model="note" class="form-control textarea" placeholder="Catatan opsional" rows="2" />
      </div>
    </form>

    <template #footer>
      <BaseButton label="Batal"            variant="secondary" @click="$emit('close')" />
      <BaseButton label="Simpan Perubahan" variant="primary"   type="submit" form="edit-trx-form" />
    </template>
  </BaseModal>
</template>

<style scoped>
.trx-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 16px;
  background: #F9FAFB;
  border: 1px solid #F3F4F6;
  border-radius: 10px;
  padding: 14px 16px;
}
.info-row  { display: flex; justify-content: space-between; align-items: center; font-size: var(--text-body); }
.total-val { font-weight: 700; color: var(--color-secondary); font-family: var(--font-heading); }
.divider   { border: none; border-top: 1px solid #F3F4F6; margin-bottom: 18px; }
.mb-f      { margin-bottom: 16px; }
.textarea  { resize: vertical; min-height: 64px; margin-top: 6px; width: 100%; }
</style>
