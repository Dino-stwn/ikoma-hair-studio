/**
 * utils/constants.js
 * Konstanta UI yang dipakai bersama oleh beberapa komponen.
 * BUKAN data usaha — tidak ada harga atau nama layanan di sini.
 */

/** Opsi metode pembayaran (nilai sesuai model data) */
export const PAYMENT_OPTIONS = [
  { value: 'tunai',    label: 'Tunai'    },
  { value: 'qris',     label: 'QRIS'     },
  { value: 'transfer', label: 'Transfer' }
]

/** Opsi termasuk pilihan "semua" untuk filter */
export const PAYMENT_OPTIONS_ALL = [
  { value: '', label: 'Semua Metode' },
  ...PAYMENT_OPTIONS
]

/** Konfigurasi badge per metode bayar */
export const PAYMENT_BADGE = {
  tunai:    { label: 'Tunai',    variant: 'neutral'  },
  qris:     { label: 'QRIS',     variant: 'success'  },
  transfer: { label: 'Transfer', variant: 'warning'  }
}

/** Konfigurasi badge per role pengguna */
export const ROLE_CONFIG = {
  owner_utama:  { label: 'Pemilik Utama', variant: 'success' },
  owner_cabang: { label: 'Kepala Cabang', variant: 'warning' },
  karyawan:     { label: 'Karyawan',      variant: 'neutral' }
}
