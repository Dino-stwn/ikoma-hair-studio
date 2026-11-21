# I KOMA Hair Studio — Sistem Informasi Manajemen

Aplikasi **frontend-only** (Vue 3 + Vite + Pinia) untuk manajemen barbershop I KOMA Hair Studio cabang ke-2.  
Tidak memerlukan server atau database — seluruh data disimpan di **localStorage** browser.

---

## Cara Menjalankan

```bash
# 1. Instal dependensi
npm install

# 2. Jalankan server pengembangan
npm run dev
```

Buka browser di **http://localhost:5173**

Untuk build produksi:

```bash
npm run build
```

---

## Akun Demo

| Role | Username | Password | Hak Akses |
|---|---|---|---|
| **Owner Utama** | `owner.utama` | `demo123` | Dashboard, Riwayat, Gaji, Laporan |
| **Owner Cabang** | `owner.cabang` | `demo123` | Semua fitur + kelola data |
| **Karyawan** | `karyawan1` | `demo123` | Dashboard, Catat Transaksi, Riwayat, Gaji |
| **Karyawan 2** | `karyawan2` | `demo123` | Sama dengan karyawan1 |

> **Catatan:** Menghapus `localStorage` di DevTools lalu reload akan memuat ulang data awal dari file seed secara otomatis.

---

## Fitur Utama

| Fitur | Role |
|---|---|
| Dashboard (StatCard, StockAlert, 5 transaksi terbaru) | Semua |
| Catat Transaksi Baru | Owner Cabang, Karyawan |
| Riwayat Transaksi (filter, ubah, hapus + kembalikan stok) | Semua (ubah/hapus: Owner Cabang) |
| Kelola Layanan (tambah, ubah, nonaktifkan) | Owner Cabang |
| Kelola Produk + Tambah Stok Cepat | Owner Cabang |
| Kelola Karyawan (tambah, aktifkan/nonaktifkan) | Owner Cabang |
| Rekap Gaji Mingguan (otomatis bagi rata + sisa) | Semua lihat; Owner Cabang simpan |
| Laporan Mingguan + Export CSV | Owner Utama, Owner Cabang |

---

## Struktur Folder

```
src/
├── assets/
│   └── main.css              # Variabel CSS global, reset, kelas utilitas
├── composables/
│   └── useAlert.js           # Composable bersama: state alert + timer auto-dismiss
├── components/
│   ├── common/               # Komponen UI dasar (reusable)
│   │   ├── AlertMessage.vue
│   │   ├── BaseBadge.vue
│   │   ├── BaseButton.vue
│   │   ├── BaseInput.vue
│   │   ├── BaseModal.vue
│   │   ├── BaseSelect.vue
│   │   ├── BaseTable.vue
│   │   ├── ConfirmDialog.vue
│   │   └── ...
│   ├── layout/               # Sidebar dan Topbar
│   │   ├── AppSidebar.vue
│   │   └── AppTopbar.vue
│   └── features/             # Komponen per-fitur
│       ├── auth/             # LoginForm
│       ├── dashboard/        # StatCard, StockAlert
│       ├── employees/        # EmployeeTable, EmployeeForm
│       ├── payrolls/         # WeekPicker, PayrollCalculation, PayrollSavePanel, PayrollTable
│       ├── products/         # ProductTable, ProductForm, StockAdjustDialog
│       ├── reports/          # ReportSummary, ReportDetailTable, ReportBarChart, ReportTrend, ReportTopItems, ExportButton
│       ├── services/         # ServiceTable, ServiceForm
│       └── transactions/     # TransactionForm, CartSummary, FilterBar, TransactionTable, EditTransactionModal
├── layouts/
│   ├── AuthLayout.vue        # Layout halaman login (tengah, latar gelap)
│   └── MainLayout.vue        # Layout utama (sidebar tetap + topbar)
├── router/
│   └── index.js              # Semua rute + navigation guard (requiresAuth, roles)
├── seed/                     # Data awal dalam format JSON
│   ├── users.json
│   ├── services.json
│   ├── products.json
│   ├── transactions.json
│   └── payrolls.json
├── stores/                   # Pinia stores (watch deep → localStorage)
│   ├── auth.js               # Login, logout, session
│   ├── users.js              # CRUD pengguna + guard owner_cabang
│   ├── services.js           # CRUD layanan + guard owner_cabang
│   ├── products.js           # CRUD produk + adjustStock + guard owner_cabang
│   ├── transactions.js       # Catat/ubah/hapus transaksi + guard owner_cabang
│   └── payrolls.js           # Simpan rekap gaji + guard owner_cabang
├── utils/
│   ├── constants.js          # Konstanta UI bersama (metode bayar, role config)
│   ├── format.js             # formatRupiah, formatTanggal, buatKodeTransaksi
│   └── storage.js            # loadOrSeed(key, seed), save(key, data)
└── views/                    # Halaman (hanya merangkai komponen fitur)
    ├── DashboardView.vue
    ├── TransaksiBaruView.vue
    ├── RiwayatView.vue
    ├── LayananView.vue
    ├── ProdukView.vue
    ├── KaryawanView.vue
    ├── GajiView.vue
    ├── LaporanView.vue
    ├── LoginView.vue
    └── ForbiddenView.vue
```

### Key localStorage

| Key | Isi |
|---|---|
| `ikoma_users` | Daftar pengguna |
| `ikoma_services` | Daftar layanan |
| `ikoma_products` | Daftar produk |
| `ikoma_transactions` | Riwayat transaksi |
| `ikoma_payrolls` | Rekap gaji tersimpan |
| `ikoma_session` | Sesi login aktif |

---

## Teknologi

- **Vue 3** (`<script setup>` di semua komponen)
- **Vite 8** (bundler)
- **Pinia 4** (state management, setup store)
- **Vue Router 4** (navigation guard berbasis role)
- **Tanpa library UI eksternal** — CSS murni dengan variabel di `main.css`
- **Font:** Poppins (heading) + Inter (body) via Google Fonts

---

## Temuan Audit & Perbaikan

Audit dilakukan berdasarkan 6 kriteria sesuai `docs/KONTEKS.md`.

### 1. `<script setup>` & Tidak Ada Data Usaha Hardcode ✅

**Temuan:**
- Objek konfigurasi metode bayar (`tunai`, `qris`, `transfer`) dan role diduplikasi di 5+ komponen secara terpisah.

**Perbaikan:**
- Dibuat `src/utils/constants.js` berisi `PAYMENT_OPTIONS`, `PAYMENT_OPTIONS_ALL`, `PAYMENT_BADGE`, dan `ROLE_CONFIG`.
- `FilterBar`, `EditTransactionModal`, `TransaksiBaruView`, `TransactionTable`, `EmployeeTable`, `ReportSummary` diperbarui untuk mengimpor dari file konstanta tersebut.

---

### 2. Komponen Halaman Tidak Melebihi ~150 Baris ✅

**Temuan sebelum perbaikan:**

| Komponen | Baris |
|---|---|
| `ReportSummary.vue` | 215 |
| `PayrollCalculation.vue` | 185 |
| `RiwayatView.vue` | 172 |
| `TransaksiBaruView.vue` | 172 |

**Perbaikan:**

| Komponen | Sebelum | Sesudah | Cara |
|---|---|---|---|
| `ReportSummary.vue` | 215 | 146 | Ekstrak `ReportDetailTable.vue` |
| `PayrollCalculation.vue` | 185 | 133 | Ekstrak `PayrollSavePanel.vue` |
| `RiwayatView.vue` | 172 | 113 | `useAlert` composable + `TransactionTable` self-contained |
| `TransaksiBaruView.vue` | 172 | 96 | `useAlert` composable + `PAYMENT_OPTIONS` |
| `DashboardView.vue` | 148 | 94 | `TransactionTable` self-contained |

Dibuat 2 komponen baru: `PayrollSavePanel.vue` dan `ReportDetailTable.vue`.

---

### 3. State Data di Pinia Store ✅

**Temuan:**
- `FilterBar.vue`: `userOptions` dibangun sebagai array statis biasa — tidak reaktif, pengguna baru tidak muncul di filter secara langsung.

**Perbaikan:**
- `userOptions` diubah menjadi `computed()` sehingga secara otomatis reaktif terhadap perubahan `usersStore.users`.

---

### 4. Data Seed Muat Ulang & Persistensi ✅

**Verifikasi:**
- `loadOrSeed(key, seed)` di `storage.js` sudah benar: jika localStorage kosong atau corrupt, data seed ditulis dan dikembalikan.
- Semua store menggunakan `watch(ref, save, { deep: true })` untuk persistensi otomatis.
- Tidak ada perubahan diperlukan — mekanisme sudah berjalan dengan benar.

---

### 5. Guard Router & Store Menolak Aksi Tidak Berhak ✅

**Temuan:**
- Router guard sudah benar untuk semua rute.
- Namun `stores/services.js`, `stores/products.js`, dan `stores/users.js`: aksi tulis (`add`, `update`, `remove`) tidak memiliki pengecekan role — hanya mengandalkan router guard.
- `stores/transactions.js` dan `stores/payrolls.js`: sudah memiliki guard ✅

**Perbaikan — guard ditambahkan di tiga store:**

```
services.js  → add(), update(), remove()   wajib role owner_cabang
products.js  → add(), update()             wajib role owner_cabang
              adjustStock()                TIDAK di-guard (dipanggil oleh
                                           transactions.add() untuk semua role)
users.js     → add(), update(), remove()   wajib role owner_cabang
```

Semua aksi kini mengembalikan `{ ok: boolean, message?: string }` sehingga komponen pemanggil dapat menampilkan pesan error jika store menolak.

Komponen yang terdampak diperbarui untuk menangani nilai kembalian:
- `ServiceForm.vue` — tangkap `result.message` jika `result.ok === false`
- `EmployeeForm.vue` — tampilkan `errors.general` jika store menolak
- `LayananView.vue`, `ProdukView.vue`, `KaryawanView.vue` — periksa `result.ok` sebelum `showAlert`

---

### 6. `npm run build` Berhasil Tanpa Error ✅

**Temuan:**
- `PayrollTable.vue`: `const tableVisible = computed(() => true)` — computed tidak digunakan di template.
- `AppLayout.vue` di `src/layouts/`: file tidak diimpor di mana pun (sisa dari tahap awal proyek).

**Perbaikan:**
- Hapus `tableVisible` dari `PayrollTable.vue` (beserta import `computed` yang kini tidak terpakai).
- Hapus `AppLayout.vue`.

**Hasil build akhir:** `✓ 136 modul, 0 error, ~945ms`

---

### Tambahan: Composable `useAlert`

**Temuan:** Pola alert (3 ref + 1 fungsi + timer) diduplikasi di 6 komponen/view:
`LayananView`, `ProdukView`, `KaryawanView`, `RiwayatView`, `TransaksiBaruView`, `PayrollCalculation`.

**Perbaikan:** Dibuat `src/composables/useAlert.js` — semua komponen di atas diperbarui untuk menggunakannya.

---

### Tambahan: `TransactionTable` Self-Contained

**Temuan:** `RiwayatView` dan `DashboardView` masing-masing menduplikasi logika `resolveItemName` + `getItemSummary` dan harus import 3 store hanya untuk menyiapkan data bagi `TransactionTable`.

**Perbaikan:** `TransactionTable.vue` kini mengimpor store secara internal dan menghitung `userName` + `itemSummary` sendiri via computed `enriched`. Pemanggil cukup meneruskan array transaksi mentah dari store.
