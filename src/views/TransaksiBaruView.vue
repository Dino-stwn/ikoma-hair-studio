<script setup>
import { ref, computed } from 'vue'
import MainLayout        from '@/layouts/MainLayout.vue'
import TransactionForm   from '@/components/features/transactions/TransactionForm.vue'
import CartSummary       from '@/components/features/transactions/CartSummary.vue'
import BaseSelect        from '@/components/common/BaseSelect.vue'
import BaseButton        from '@/components/common/BaseButton.vue'
import AlertMessage      from '@/components/common/AlertMessage.vue'
import { useAlert }      from '@/composables/useAlert'
import { PAYMENT_OPTIONS } from '@/utils/constants'
import { formatRupiah }    from '@/utils/format'
import { useAuthStore }         from '@/stores/auth'
import { useTransactionsStore } from '@/stores/transactions'

const auth     = useAuthStore()
const trxStore = useTransactionsStore()
const { alertMsg, alertType, showAlert, clearAlert } = useAlert()

const cart          = ref([])
const paymentMethod = ref('tunai')
const trxNote       = ref('')
const cartError     = ref('')
const cartTotal     = computed(() => cart.value.reduce((s, i) => s + i.subtotal, 0))

function handleAddItem(item)   { cart.value.push(item); cartError.value = '' }
function handleRemoveItem(idx) { cart.value.splice(idx, 1) }

function handleSubmit() {
  if (cart.value.length === 0) { cartError.value = 'Keranjang kosong. Tambahkan minimal satu item.'; return }
  cartError.value = ''

  const result = trxStore.add({
    user_id:        auth.currentUser.id,
    payment_method: paymentMethod.value,
    note:           trxNote.value.trim(),
    items:          cart.value
  })

  if (!result.ok) { showAlert(result.message, 'error'); return }
  showAlert(`Transaksi ${result.code} berhasil dicatat.`, 'success')
  cart.value = []; paymentMethod.value = 'tunai'; trxNote.value = ''
}
</script>

<template>
  <MainLayout>
    <div class="page-header">
      <div>
        <h1>Transaksi Baru</h1>
        <p class="page-sub">Pencatat: <strong>{{ auth.currentUser?.name }}</strong></p>
      </div>
    </div>

    <AlertMessage :type="alertType" :message="alertMsg" @close="clearAlert" />

    <div class="trx-layout">
      <div class="card panel-left">
        <h2 class="panel-heading">Tambah Item</h2>
        <TransactionForm :cart="cart" @add-item="handleAddItem" />
      </div>

      <div class="panel-right">
        <div class="card">
          <CartSummary :items="cart" :total="cartTotal" @remove="handleRemoveItem" />
          <p v-if="cartError" class="cart-error">⚠ {{ cartError }}</p>
        </div>

        <div class="card payment-panel">
          <h2 class="panel-heading">Pembayaran</h2>
          <BaseSelect v-model="paymentMethod" label="Metode Pembayaran" :options="PAYMENT_OPTIONS" class="mb-f" />
          <div class="mb-f">
            <label class="field-label">Catatan Transaksi <span class="opt-label">(opsional)</span></label>
            <textarea v-model="trxNote" class="form-control textarea" placeholder="cth. Pelanggan tetap, diskon khusus" rows="2" />
          </div>

          <div class="total-banner">
            <span class="total-banner__label">Total Pembayaran</span>
            <span class="total-banner__value">{{ formatRupiah(cartTotal) }}</span>
          </div>

          <BaseButton label="Simpan Transaksi" variant="primary" class="btn-full" @click="handleSubmit" />
        </div>
      </div>
    </div>
  </MainLayout>
</template>

<style scoped>
.page-header { margin-bottom: 20px; }
.page-sub { color: #6B7280; margin-top: 6px; font-size: var(--text-body); }
.panel-heading { font-family: var(--font-heading); font-size: var(--text-subheading); font-weight: 600; color: var(--color-secondary); margin-bottom: 18px; }
.trx-layout { display: grid; grid-template-columns: 380px 1fr; gap: 20px; align-items: start; }
.panel-right { display: flex; flex-direction: column; gap: 16px; }
.mb-f { margin-bottom: 16px; }
.btn-full { width: 100%; justify-content: center; }
.textarea { resize: vertical; min-height: 64px; margin-top: 6px; }
.field-label { display: block; font-size: var(--text-label); font-weight: 600; color: #374151; letter-spacing: 0.3px; margin-bottom: 6px; }
.opt-label { font-weight: 400; color: #9CA3AF; }
.cart-error { color: var(--color-danger); font-size: var(--text-label); margin-top: 10px; font-weight: 500; background: var(--color-danger-tint); padding: 8px 12px; border-radius: 8px; }
.total-banner { display: flex; justify-content: space-between; align-items: center; background: var(--color-primary-tint); border: 1px solid rgba(201,162,39,0.25); border-radius: 10px; padding: 14px 18px; margin-bottom: 16px; }
.total-banner__label { font-size: var(--text-body); font-weight: 600; color: #6B4E00; }
.total-banner__value { font-family: var(--font-heading); font-size: 20px; font-weight: 700; color: var(--color-secondary); }
@media (max-width: 768px) { .trx-layout { grid-template-columns: 1fr; } }
</style>
