/**
 * seed/transactions.js — Data awal transaksi (contoh)
 */
export const transactionseed = [
  {
    id: 'trx1',
    code: 'TRX-001',
    user_id: 'u3',
    trx_date: '2026-11-14',
    payment_method: 'tunai',
    total: 85000,
    note: '',
    items: [
      {
        item_type: 'service',
        service_id: 's1',
        product_id: null,
        qty: 1,
        unit_price: 35000,
        subtotal: 35000,
        note: ''
      },
      {
        item_type: 'product',
        service_id: null,
        product_id: 'p1',
        qty: 1,
        unit_price: 85000,
        subtotal: 85000,
        note: ''
      }
    ]
  },
  {
    id: 'trx2',
    code: 'TRX-002',
    user_id: 'u4',
    trx_date: '2026-11-15',
    payment_method: 'qris',
    total: 50000,
    note: 'Pelanggan tetap',
    items: [
      {
        item_type: 'service',
        service_id: 's2',
        product_id: null,
        qty: 1,
        unit_price: 50000,
        subtotal: 50000,
        note: ''
      }
    ]
  }
]
