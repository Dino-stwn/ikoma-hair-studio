/**
 * utils/format.js
 * Fungsi pemformatan tampilan uang, tanggal, dan kode transaksi.
 */

// ─── Uang ────────────────────────────────────────────────────────────────────

/**
 * Format integer Rupiah tanpa spasi setelah "Rp": "Rp30.000"
 * @param {number|null|undefined} amount
 * @returns {string}
 */
export function formatRupiah(amount) {
  if (amount == null) return 'Rp0'
  return 'Rp' + Number(amount).toLocaleString('id-ID')
}

// ─── Tanggal ─────────────────────────────────────────────────────────────────

/**
 * Format tanggal ISO "YYYY-MM-DD" atau ISO penuh ke
 * format panjang Indonesia: "09 November 2026"
 * @param {string|null|undefined} isoDate
 * @returns {string}
 */
export function formatTanggal(isoDate) {
  if (!isoDate) return '-'
  // Tambahkan T00:00:00 agar tidak bergeser zona waktu di beberapa environment
  const date = new Date(isoDate.length === 10 ? isoDate + 'T00:00:00' : isoDate)
  if (isNaN(date.getTime())) return '-'
  return date.toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  })
}

/**
 * Format tanggal ISO ke format pendek: "09 Nov 2026"
 * @param {string|null|undefined} isoDate
 * @returns {string}
 */
export function formatTanggalPendek(isoDate) {
  if (!isoDate) return '-'
  const date = new Date(isoDate.length === 10 ? isoDate + 'T00:00:00' : isoDate)
  if (isNaN(date.getTime())) return '-'
  return date.toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  })
}

/**
 * Format tanggal ISO ke "09 Nov 2026, 14:30"
 * @param {string|null|undefined} isoDate
 * @returns {string}
 */
export function formatTanggalWaktu(isoDate) {
  if (!isoDate) return '-'
  const date = new Date(isoDate)
  if (isNaN(date.getTime())) return '-'
  return date.toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

/**
 * Tanggal hari ini dalam format ISO "YYYY-MM-DD"
 * @returns {string}
 */
export function todayISO() {
  return new Date().toISOString().split('T')[0]
}

// ─── Kode Transaksi ───────────────────────────────────────────────────────────

/**
 * Buat kode transaksi berformat TRX-YYYYMMDD-NNN.
 * NNN dihitung dari jumlah transaksi yang sudah ada pada tanggal yang sama,
 * ditambah 1, dipad ke 3 digit.
 *
 * @param {string} isoDate          - Tanggal transaksi "YYYY-MM-DD"
 * @param {Array<{code: string}>} existingTrx - Daftar transaksi yang sudah ada
 * @returns {string} contoh: "TRX-20261116-003"
 */
export function buatKodeTransaksi(isoDate, existingTrx = []) {
  const dateStr = isoDate.replace(/-/g, '')           // "20261116"
  const prefix  = `TRX-${dateStr}-`

  const urutan = existingTrx
    .map((t) => t.code)
    .filter((c) => c && c.startsWith(prefix))
    .map((c) => parseInt(c.slice(prefix.length), 10))
    .filter((n) => !isNaN(n))

  const max = urutan.length > 0 ? Math.max(...urutan) : 0
  return prefix + String(max + 1).padStart(3, '0')
}
