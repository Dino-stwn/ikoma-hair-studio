<script setup>
import { ref } from 'vue'
import MainLayout        from '@/layouts/MainLayout.vue'
import ProductTable      from '@/components/features/products/ProductTable.vue'
import ProductForm       from '@/components/features/products/ProductForm.vue'
import StockAdjustDialog from '@/components/features/products/StockAdjustDialog.vue'
import AlertMessage      from '@/components/common/AlertMessage.vue'
import BaseButton        from '@/components/common/BaseButton.vue'
import { useAlert }      from '@/composables/useAlert'
import { useProductsStore } from '@/stores/products'

const store = useProductsStore()
const { alertMsg, alertType, showAlert, clearAlert } = useAlert()

// ── Form tambah / ubah ─────────────────────────────────────────────────────
const showForm   = ref(false)
const editTarget = ref(null)

function openAdd()         { editTarget.value = null; showForm.value = true }
function openEdit(product) { editTarget.value = { ...product }; showForm.value = true }

function onSaved({ mode, data }) {
  const result = mode === 'ubah'
    ? store.update(editTarget.value.id, data)
    : store.add(data)

  showForm.value = false; editTarget.value = null

  if (result && !result.ok) { showAlert(result.message, 'error'); return }
  showAlert(`Produk berhasil ${mode === 'ubah' ? 'diperbarui' : 'ditambahkan'}.`)
}

// ── Tambah stok cepat ──────────────────────────────────────────────────────
const showRestock   = ref(false)
const restockTarget = ref(null)

function openRestock(product) { restockTarget.value = product; showRestock.value = true }
function onRestockConfirm(delta) {
  store.adjustStock(restockTarget.value.id, delta)
  showAlert(`Stok ${restockTarget.value.name} ditambah ${delta} unit.`)
  showRestock.value = false; restockTarget.value = null
}
</script>

<template>
  <MainLayout>
    <div class="page-header">
      <div>
        <h1>Manajemen Produk</h1>
        <p class="page-sub">Kelola produk dan pantau stok barbershop.</p>
      </div>
      <BaseButton label="+ Tambah Produk" variant="primary" @click="openAdd" />
    </div>

    <AlertMessage :type="alertType" :message="alertMsg" @close="clearAlert" />

    <div class="card mt-card">
      <ProductTable :rows="store.products" @edit="openEdit" @restock="openRestock" />
    </div>

    <ProductForm       :show="showForm"    :edit-target="editTarget" @close="showForm = false"    @saved="onSaved" />
    <StockAdjustDialog :show="showRestock" :product="restockTarget"  @close="showRestock = false" @confirm="onRestockConfirm" />
  </MainLayout>
</template>

<style scoped>
.page-header {
  display: flex; align-items: flex-start; justify-content: space-between;
  gap: 16px; margin-bottom: 16px; flex-wrap: wrap;
}
.page-sub { color: #6B7280; margin-top: 4px; font-size: var(--text-body); }
.mt-card  { margin-top: 4px; }
</style>
