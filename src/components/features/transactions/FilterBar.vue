<script setup>
import { computed, reactive, watch } from 'vue'
import BaseInput  from '@/components/common/BaseInput.vue'
import BaseSelect from '@/components/common/BaseSelect.vue'
import BaseButton from '@/components/common/BaseButton.vue'
import { useUsersStore } from '@/stores/users'
import { PAYMENT_OPTIONS_ALL } from '@/utils/constants'

const emit = defineEmits(['change'])

const usersStore = useUsersStore()

const filter = reactive({
  dateFrom:      '',
  dateTo:        '',
  paymentMethod: '',
  userId:        ''
})

/** Reaktif agar user baru yang ditambahkan langsung muncul di filter */
const userOptions = computed(() => [
  { value: '', label: 'Semua Pencatat' },
  ...usersStore.users.map((u) => ({ value: u.id, label: u.name }))
])

// Emit filter setiap ada perubahan
watch(filter, () => emit('change', { ...filter }), { deep: true, immediate: true })

function reset() {
  filter.dateFrom      = ''
  filter.dateTo        = ''
  filter.paymentMethod = ''
  filter.userId        = ''
}
</script>

<template>
  <div class="filter-bar card">
    <div class="filter-grid">
      <BaseInput v-model="filter.dateFrom"      label="Tanggal Dari" type="date" />
      <BaseInput v-model="filter.dateTo"        label="Sampai"       type="date" />
      <BaseSelect v-model="filter.paymentMethod" label="Metode Bayar" :options="PAYMENT_OPTIONS_ALL" />
      <BaseSelect v-model="filter.userId"        label="Pencatat"     :options="userOptions" />
    </div>
    <div class="filter-actions">
      <BaseButton label="Reset Filter" variant="ghost" @click="reset" />
    </div>
  </div>
</template>

<style scoped>
.filter-bar  { margin-bottom: 16px; }
.filter-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(170px, 1fr));
  gap: 12px; margin-bottom: 12px;
}
.filter-actions { display: flex; justify-content: flex-end; }
</style>
