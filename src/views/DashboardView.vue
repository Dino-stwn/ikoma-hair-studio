<script setup>
import { ref, computed } from 'vue'
import MainLayout   from '@/layouts/MainLayout.vue'
import StatCard     from '@/components/features/dashboard/StatCard.vue'
import StockAlert   from '@/components/features/dashboard/StockAlert.vue'
import TransactionTable from '@/components/features/transactions/TransactionTable.vue'
import { useTransactionsStore } from '@/stores/transactions'
import { useProductsStore }     from '@/stores/products'
import { useAuthStore }         from '@/stores/auth'
import { formatRupiah, formatTanggalPendek } from '@/utils/format'

const auth     = useAuthStore()
const trxStore = useTransactionsStore()
const prdStore = useProductsStore()

// ── Helpers tanggal ────────────────────────────────────────────────────────
const today = new Date().toISOString().split('T')[0]

function getMondayISO(isoDate) {
  const d = new Date(isoDate + 'T00:00:00')
  const day = d.getDay()
  const diff = day === 0 ? -6 : 1 - day
  d.setDate(d.getDate() + diff)
  return d.toISOString().split('T')[0]
}

const weekStart = getMondayISO(today)
const weekEnd   = (() => {
  const d = new Date(weekStart + 'T00:00:00')
  d.setDate(d.getDate() + 6)
  return d.toISOString().split('T')[0]
})()

// ── StatCards ──────────────────────────────────────────────────────────────
const trxHariIni = computed(() =>
  trxStore.transactions.filter(t => t.trx_date === today)
)
const pendapatanHariIni   = computed(() => trxHariIni.value.reduce((s, t) => s + t.total, 0))
const jumlahTrxHariIni    = computed(() => trxHariIni.value.length)
const pendapatanMingguIni = computed(() =>
  trxStore.transactions
    .filter(t => t.trx_date >= weekStart && t.trx_date <= weekEnd)
    .reduce((s, t) => s + t.total, 0)
)
const perluRestok = computed(() =>
  prdStore.products.filter(p => p.stock <= p.min_stock)
)

// ── Transaksi terbaru (5) — raw; TransactionTable enrich internally ────────
const trxTerbaru = computed(() =>
  [...trxStore.transactions]
    .sort((a, b) => (b.trx_date > a.trx_date ? 1 : b.trx_date < a.trx_date ? -1 : 0))
    .slice(0, 5)
)
</script>

<template>
  <MainLayout>
    <div class="page-header">
      <div>
        <h1>Dashboard</h1>
        <p class="page-sub">
          Selamat datang, <strong>{{ auth.currentUser?.name }}</strong> —
          <span class="today-label">{{ formatTanggalPendek(today) }}</span>
        </p>
      </div>
    </div>

    <div class="stats-grid">
      <StatCard
        title="Pendapatan Hari Ini"
        :value="formatRupiah(pendapatanHariIni)"
        :hint="`${jumlahTrxHariIni} transaksi`"
        icon="💵"
        variant="success"
      />
      <StatCard
        title="Pendapatan Minggu Ini"
        :value="formatRupiah(pendapatanMingguIni)"
        hint="Senin s.d. hari ini"
        icon="📈"
        variant="default"
      />
      <StatCard
        title="Transaksi Hari Ini"
        :value="String(jumlahTrxHariIni)"
        hint="transaksi tercatat"
        icon="🧾"
        variant="default"
      />
      <StatCard
        title="Produk Perlu Restok"
        :value="String(perluRestok.length)"
        :hint="perluRestok.length ? 'Stok habis / menipis' : 'Semua stok aman'"
        icon="📦"
        :variant="perluRestok.length ? 'danger' : 'success'"
      />
    </div>

    <StockAlert :products="prdStore.products" />

    <div class="card">
      <h2 class="section-title">5 Transaksi Terbaru</h2>
      <TransactionTable :rows="trxTerbaru" :show-actions="false" />
    </div>
  </MainLayout>
</template>

<style scoped>
.page-header { margin-bottom: 24px; }
.page-sub    { color: #6B7280; margin-top: 6px; font-size: var(--text-body); }
.today-label { color: #9CA3AF; }
.stats-grid  {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
}
.section-title { font-size: var(--text-subheading); margin-bottom: 16px; }

@media (max-width: 600px) {
  .stats-grid { grid-template-columns: 1fr 1fr; }
}
@media (max-width: 360px) {
  .stats-grid { grid-template-columns: 1fr; }
}
</style>
