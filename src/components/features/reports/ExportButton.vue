<script setup>
/**
 * ExportButton.vue — Unduh laporan mingguan sebagai CSV via Blob.
 * Tidak membutuhkan library eksternal.
 */
import BaseButton from '@/components/common/BaseButton.vue'
import { formatRupiah, formatTanggalPendek } from '@/utils/format'

const props = defineProps({
  weekStart:    { type: String, default: '' },
  weekEnd:      { type: String, default: '' },
  transactions: { type: Array,  default: () => [] },
  services:     { type: Array,  default: () => [] },
  users:        { type: Array,  default: () => [] }
})

/** Escape nilai CSV: bungkus dengan kutip jika mengandung koma/kutip/newline */
function csvCell(val) {
  const s = String(val ?? '')
  if (s.includes(',') || s.includes('"') || s.includes('\n')) {
    return '"' + s.replace(/"/g, '""') + '"'
  }
  return s
}

function row(...cells) {
  return cells.map(csvCell).join(',') + '\r\n'
}

function resolveItemName(item) {
  if (item.item_type === 'service')
    return props.services.find(s => s.id === item.service_id)?.name ?? 'Layanan'
  return `Produk #${item.product_id}`
}

function downloadCsv() {
  if (!props.weekStart || !props.transactions.length) return

  const periodLabel = `${formatTanggalPendek(props.weekStart)} - ${formatTanggalPendek(props.weekEnd)}`

  let csv = '\uFEFF' // BOM agar Excel bisa baca UTF-8

  // ── Header laporan ──────────────────────────────────────────────────────
  csv += row('LAPORAN MINGGUAN I KOMA HAIR STUDIO')
  csv += row('Periode', periodLabel)
  csv += row('Total Transaksi', props.transactions.length)
  csv += row('Total Pendapatan', formatRupiah(props.transactions.reduce((s, t) => s + t.total, 0)))
  csv += row('')

  // ── Daftar transaksi ────────────────────────────────────────────────────
  csv += row('=== DAFTAR TRANSAKSI ===')
  csv += row('Kode', 'Tanggal', 'Pencatat', 'Metode Bayar', 'Item', 'Total', 'Catatan')
  for (const t of props.transactions) {
    const pencatat   = props.users.find(u => u.id === t.user_id)?.name ?? t.user_id
    const itemNames  = t.items.map(resolveItemName).join('; ')
    csv += row(t.code, t.trx_date, pencatat, t.payment_method, itemNames, t.total, t.note)
  }
  csv += row('')

  // ── Rincian per metode ──────────────────────────────────────────────────
  csv += row('=== PER METODE BAYAR ===')
  csv += row('Metode', 'Jumlah Transaksi', 'Total')
  const metodeKeys = ['tunai', 'qris', 'transfer']
  for (const key of metodeKeys) {
    const trxs = props.transactions.filter(t => t.payment_method === key)
    csv += row(key, trxs.length, trxs.reduce((s, t) => s + t.total, 0))
  }
  csv += row('')

  // ── Rincian per layanan ─────────────────────────────────────────────────
  csv += row('=== PER LAYANAN ===')
  csv += row('Layanan', 'Jumlah (qty)', 'Total Pendapatan')
  const layananMap = {}
  for (const t of props.transactions) {
    for (const item of t.items) {
      if (item.item_type !== 'service') continue
      const id = item.service_id
      if (!layananMap[id]) layananMap[id] = { qty: 0, total: 0 }
      layananMap[id].qty   += item.qty
      layananMap[id].total += item.subtotal
    }
  }
  for (const [id, v] of Object.entries(layananMap).sort((a, b) => b[1].total - a[1].total)) {
    const name = props.services.find(s => s.id === id)?.name ?? `Layanan #${id}`
    csv += row(name, v.qty, v.total)
  }
  csv += row('')

  // ── Rincian per karyawan ────────────────────────────────────────────────
  csv += row('=== PER KARYAWAN (PENCATAT) ===')
  csv += row('Nama', 'Jumlah Transaksi', 'Total Dicatat')
  const karyawanMap = {}
  for (const t of props.transactions) {
    if (!karyawanMap[t.user_id]) karyawanMap[t.user_id] = { count: 0, total: 0 }
    karyawanMap[t.user_id].count++
    karyawanMap[t.user_id].total += t.total
  }
  for (const [uid, v] of Object.entries(karyawanMap).sort((a, b) => b[1].total - a[1].total)) {
    const name = props.users.find(u => u.id === uid)?.name ?? `User #${uid}`
    csv += row(name, v.count, v.total)
  }

  // ── Unduh ───────────────────────────────────────────────────────────────
  const blob     = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url      = URL.createObjectURL(blob)
  const filename = `laporan-ikoma-${props.weekStart}-${props.weekEnd}.csv`
  const a        = document.createElement('a')
  a.href         = url
  a.download     = filename
  a.style.display = 'none'
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
</script>

<template>
  <BaseButton
    label="⬇ Unduh CSV"
    variant="secondary"
    :disabled="!weekStart || !transactions.length"
    @click="downloadCsv"
  />
</template>
