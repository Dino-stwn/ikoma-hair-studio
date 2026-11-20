/**
 * seed/users.js — Data awal pengguna
 */
export const userseed = [
  {
    id: 'u1',
    name: 'Pemilik Utama',
    username: 'owner',
    password: 'owner123',
    role: 'owner_utama',
    is_active: true
  },
  {
    id: 'u2',
    name: 'Kepala Cabang',
    username: 'cabang',
    password: 'cabang123',
    role: 'owner_cabang',
    is_active: true
  },
  {
    id: 'u3',
    name: 'Budi Santoso',
    username: 'budi',
    password: 'budi123',
    role: 'karyawan',
    is_active: true
  },
  {
    id: 'u4',
    name: 'Raka Pratama',
    username: 'raka',
    password: 'raka123',
    role: 'karyawan',
    is_active: true
  }
]
