/**
 * composables/useAlert.js
 * Composable bersama untuk state alert + timer auto-dismiss.
 * Dipakai di LayananView, ProdukView, KaryawanView, RiwayatView,
 * TransaksiBaruView, PayrollCalculation agar tidak ada duplikasi.
 */
import { ref } from 'vue'

/**
 * @param {number} duration - Milidetik sebelum alert hilang otomatis (default 4000)
 */
export function useAlert(duration = 4000) {
  const alertMsg  = ref('')
  const alertType = ref('success')
  let   timer     = null

  function showAlert(msg, type = 'success') {
    alertMsg.value  = msg
    alertType.value = type
    clearTimeout(timer)
    timer = setTimeout(() => { alertMsg.value = '' }, duration)
  }

  function clearAlert() {
    alertMsg.value = ''
    clearTimeout(timer)
  }

  return { alertMsg, alertType, showAlert, clearAlert }
}
