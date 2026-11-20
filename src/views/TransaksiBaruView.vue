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
import { useAuthStore }         from '@/stores/auth'
import { useTransactionsStore } from '@/stores/transactions'

const auth     = useAuthStore()
const trxStore = useTransactionsStore()
const { alertMsg, alertType, showAlert, clearAlert } = useAlert()

// ── State keranjang & pembayaran ───────────────────────────────────────────
const cart          = ref([])
const paymentMethod = ref('tunai')
const trxNote       = ref('')
const cartError     = ref('')

const cartTotal = computed(() => cart.value.reduce((s, i) => s + i.subtotal, 0))

// ── Keranjang ──────────────────────────────────────────────────────────────
function handleAddItem(item)  { cart.value.push(item); cartError.value = '' }
function handleRemoveItem(idx) { cart.value.splice(idx, 1) }

// ── Submit ─────────────────────────────────────────────────────────────────
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
      <!-- Kiri: form pilih item -->
      <div class="card panel-left">
        <TransactionForm :cart="cart" @add-item="handleAddItem" />
      </div>

      <!-- Kanan: keranjang + pembayaran + submit -->
      <div class="panel-right">
        <div class="card">
          <CartSummary :items="cart" :total="cartTotal" @remove="handleRemoveItem" />
          <p v-if="cartError" class="cart-error">{{ cartError }}</p>
        </div>

        <div class="card payment-panel">
          <BaseSelect v-model="paymentMethod" label="Metode Pembayaran" :options="PAYMENT_OPTIONS" class="mb-f" />
          <div class="mb-f">
            <label class="label">Catatan Transaksi (opsional)</label>
            <textarea v-model="trxNote" class="form-control textarea" placeholder="cth. Pelanggan tetap, diskon khusus" rows="2" />
          </div>
          <BaseButton label="💾 Simpan Transaksi" variant="primary" class="btn-full" @click="handleSubmit" />
        </div>
      </div>
    </div>
  </MainLayout>
</template>

<style scoped>
.page-header { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 16px; }
.page-sub    { color: #6B7280; margin-top: 4px; font-size: var(--text-body); }
.trx-layout  { display: grid; grid-template-columns: 380px 1fr; gap: 20px; align-items: start; }
@media (max-width: 768px) { .trx-layout { grid-template-columns: 1fr; } }
.panel-right  { display: flex; flex-direction: column; gap: 16px; }
.mb-f         { margin-bottom: 14px; }
.btn-full     { width: 100%; justify-content: center; }
.textarea     { resize: vertical; min-height: 60px; margin-top: 4px; }
.cart-error   { color: var(--color-danger); font-size: var(--text-label); margin-top: 8px; font-weight: 500; }
</style>
