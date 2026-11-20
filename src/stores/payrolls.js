import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import { loadOrSeed, save } from '@/utils/storage'
import { useAuthStore } from '@/stores/auth'
import payrollseed from '@/seed/payrolls.json'

const KEY = 'ikoma_payrolls'

export const usePayrollsStore = defineStore('payrolls', () => {
  const payrolls = ref(loadOrSeed(KEY, payrollseed))

  watch(payrolls, (val) => save(KEY, val), { deep: true })

  /**
   * Simpan rekap gaji mingguan.
   * Ditolak jika: bukan owner_cabang, atau minggu yang sama sudah ada.
   *
   * @param {{
   *   week_start: string, week_end: string,
   *   total_revenue: number, deduction: number, net_total: number,
   *   details: Array<{ user_id: string, amount: number }>
   * }} payload
   * @returns {{ ok: boolean, message?: string }}
   */
  function add(payload) {
    const auth = useAuthStore()
    if (auth.role !== 'owner_cabang')
      return { ok: false, message: 'Hanya Kepala Cabang yang dapat menyimpan rekap gaji.' }

    const duplicate = payrolls.value.find((p) => p.week_start === payload.week_start)
    if (duplicate)
      return { ok: false, message: `Rekap minggu ini (${payload.week_start}) sudah pernah disimpan.` }

    payrolls.value.push({
      id:            String(Date.now()),
      week_start:    payload.week_start,
      week_end:      payload.week_end,
      total_revenue: payload.total_revenue,
      deduction:     payload.deduction,
      net_total:     payload.net_total,
      created_by:    auth.currentUser.id,
      details:       payload.details   // [{ user_id, amount }]
    })
    return { ok: true }
  }

  function isWeekSaved(weekStart) {
    return payrolls.value.some((p) => p.week_start === weekStart)
  }

  return { payrolls, add, isWeekSaved }
})
