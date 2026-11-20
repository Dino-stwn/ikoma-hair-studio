# KONTEKS PROYEK

## Sistem Informasi Manajemen Barbershop
**I KOMA Hair Studio — Cabang ke-2**

Aplikasi frontend saja tanpa backend. Data awal dari file JSON di `src/seed`, disimpan ke `localStorage`. Seluruh teks antarmuka berbahasa Indonesia.

---

## ATURAN TEKNIS

- Vue 3 + Vite, JavaScript (bukan TypeScript). Semua komponen memakai `<script setup>`.
- Vue Router dengan meta `{ requiresAuth, roles }` dan navigation guard.
- State terpusat dengan Pinia (setup store). Komponen tidak boleh menulis data usaha secara langsung (tanpa hardcode); semua data berasal dari store.
- Komponen kecil dan reusable (usahakan di bawah 150 baris). Views hanya merangkai komponen fitur.
- Tanpa library UI eksternal. Gunakan CSS biasa dengan variabel di `src/assets/main.css`.
- Setiap tambah, ubah, hapus data langsung tersimpan ke localStorage (watch deep di store). `utils/storage.js` berisi `loadOrSeed(key, seed)`: baca localStorage, jika kosong atau rusak pakai seed lalu simpan.

---

## KEY LOCALSTORAGE

| Key | Deskripsi |
|-----|-----------|
| `ikoma_users` | Data pengguna |
| `ikoma_services` | Data layanan |
| `ikoma_products` | Data produk |
| `ikoma_transactions` | Data transaksi |
| `ikoma_payrolls` | Data penggajian |
| `ikoma_session` | Sesi login aktif |

---

## ROLE

| Role | Deskripsi |
|------|-----------|
| `owner_utama` | Pemilik utama, akses penuh laporan |
| `owner_cabang` | Kepala cabang, kelola operasional harian |
| `karyawan` | Staf, hanya transaksi dan lihat gaji sendiri |

---

## RUTE DAN HAK AKSES

| Path | Akses |
|------|-------|
| `/login` | Tamu |
| `/` (Dashboard) | Semua role |
| `/transaksi/baru` | `owner_cabang`, `karyawan` |
| `/riwayat` | Semua role (tombol ubah & hapus hanya `owner_cabang`) |
| `/layanan` | `owner_cabang` |
| `/produk` | `owner_cabang` |
| `/karyawan` | `owner_cabang` |
| `/gaji` | Semua role lihat; hanya `owner_cabang` hitung & simpan |
| `/laporan` | `owner_utama`, `owner_cabang` |
| `/forbidden` | Halaman penolakan akses |

---

## MODEL DATA

### users
| Field | Tipe | Keterangan |
|-------|------|-----------|
| `id` | string | ID unik |
| `name` | string | Nama lengkap |
| `username` | string | Username login |
| `password` | string | Password (plain, localStorage only) |
| `role` | string | `owner_utama` / `owner_cabang` / `karyawan` |
| `is_active` | boolean | Status aktif |

### services
| Field | Tipe | Keterangan |
|-------|------|-----------|
| `id` | string | ID unik |
| `name` | string | Nama layanan |
| `price` | number | Harga (integer Rupiah) |
| `is_active` | boolean | Status aktif |

### products
| Field | Tipe | Keterangan |
|-------|------|-----------|
| `id` | string | ID unik |
| `name` | string | Nama produk |
| `type` | string | `gel` atau `powder` |
| `price` | number | Harga (integer Rupiah) |
| `stock` | number | Stok saat ini |
| `min_stock` | number | Batas stok minimum (peringatan) |

### transactions
| Field | Tipe | Keterangan |
|-------|------|-----------|
| `id` | string | ID unik |
| `code` | string | Kode transaksi (TRX-001) |
| `user_id` | string | ID karyawan yang melayani |
| `trx_date` | string | Tanggal ISO (YYYY-MM-DD) |
| `payment_method` | string | `tunai` / `qris` / `transfer` |
| `total` | number | Total (integer Rupiah) |
| `note` | string | Catatan opsional |
| `items` | array | Daftar item (lihat di bawah) |

### items (dalam transaction)
| Field | Tipe | Keterangan |
|-------|------|-----------|
| `item_type` | string | `service` atau `product` |
| `service_id` | string\|null | ID layanan (jika service) |
| `product_id` | string\|null | ID produk (jika product) |
| `qty` | number | Jumlah |
| `unit_price` | number | Harga satuan |
| `subtotal` | number | qty × unit_price |
| `note` | string | Catatan item |

### payrolls
| Field | Tipe | Keterangan |
|-------|------|-----------|
| `id` | string | ID unik |
| `week_start` | string | Tanggal mulai minggu (ISO) |
| `week_end` | string | Tanggal akhir minggu (ISO) |
| `total_revenue` | number | Total omzet periode |
| `deduction` | number | Potongan operasional |
| `net_total` | number | Omzet bersih untuk dibagi |
| `created_by` | string | ID user yang menghitung |
| `details` | array | `[{ user_id, amount }]` |

---

## GAYA VISUAL

### Variabel CSS
```css
--color-primary:   #C9A227
--color-secondary: #1F2937
--color-bg:        #F9FAFB
--color-surface:   #FFFFFF
--color-text:      #111827
--color-success:   #16A34A
--color-warning:   #F59E0B
--color-danger:    #DC2626
```

### Tipografi
| Elemen | Font | Ukuran | Bobot |
|--------|------|--------|-------|
| Judul halaman | Poppins | 24px | 700 |
| Subjudul | Poppins | 18px | 600 |
| Teks isi | Inter | 14px | 400 |
| Label | Inter | 12px | 500 |
| Tombol | Inter | 14px | 500 |

> Teks pada tombol primary memakai `--color-text` (#111827).

---

## STRUKTUR FOLDER

```
src/
├── assets/
│   └── main.css              # Variabel CSS & reset global
├── components/
│   ├── common/               # Komponen reusable umum
│   ├── layout/               # Header, Sidebar, dsb.
│   └── features/
│       ├── auth/
│       ├── dashboard/
│       ├── transactions/
│       ├── services/
│       ├── products/
│       ├── payrolls/
│       ├── employees/
│       └── reports/
├── layouts/
│   └── AppLayout.vue         # Layout utama dengan sidebar
├── views/                    # Halaman (merangkai komponen)
├── router/
│   └── index.js              # Route + navigation guard
├── stores/                   # Pinia stores
│   ├── auth.js
│   ├── users.js
│   ├── services.js
│   ├── products.js
│   ├── transactions.js
│   └── payrolls.js
├── seed/                     # Data awal JSON
│   ├── users.js
│   ├── services.js
│   ├── products.js
│   ├── transactions.js
│   └── payrolls.js
├── utils/
│   ├── storage.js            # loadOrSeed, save
│   └── format.js             # formatRupiah, formatTanggal
├── App.vue
└── main.js
```
