/**
 * utils/storage.js
 *
 * loadOrSeed(key, seed):
 *   Baca localStorage dengan try/catch.
 *   Jika kosong atau rusak (parse gagal), tulis seed ke localStorage
 *   lalu kembalikan salinan deep-copy-nya agar seed asli tidak termutasi.
 *
 * save(key, data):
 *   Serialisasi data ke localStorage (dipanggil oleh store via watch deep).
 */

/**
 * @template T
 * @param {string} key - Key localStorage (misal 'ikoma_services')
 * @param {T} seed     - Data awal yang digunakan jika localStorage kosong/rusak
 * @returns {T}
 */
export function loadOrSeed(key, seed) {
  try {
    const raw = localStorage.getItem(key)
    if (raw === null || raw === '') throw new Error('empty')
    const parsed = JSON.parse(raw)
    // Tolak jika hasil parse bukan tipe yang masuk akal (null, angka, dsb.)
    if (parsed === null || typeof parsed !== 'object') throw new Error('invalid')
    return parsed
  } catch {
    const copy = JSON.parse(JSON.stringify(seed))
    localStorage.setItem(key, JSON.stringify(copy))
    return copy
  }
}

/**
 * @param {string} key
 * @param {unknown} data
 */
export function save(key, data) {
  localStorage.setItem(key, JSON.stringify(data))
}
