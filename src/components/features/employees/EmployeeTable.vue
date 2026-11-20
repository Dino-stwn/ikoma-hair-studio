<script setup>
import BaseBadge  from '@/components/common/BaseBadge.vue'
import BaseButton from '@/components/common/BaseButton.vue'
import { ROLE_CONFIG } from '@/utils/constants'

const props = defineProps({
  rows:          { type: Array,  default: () => [] },
  currentUserId: { type: String, default: '' }
})
defineEmits(['toggle'])

function isSelf(user) {
  return user.id === props.currentUserId
}
</script>

<template>
  <div class="table-wrapper">
    <table class="table">
      <thead>
        <tr>
          <th>No</th>
          <th>Nama</th>
          <th>Username</th>
          <th>Role</th>
          <th class="text-center">Status</th>
          <th class="text-center col-aksi">Aksi</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="rows.length === 0">
          <td colspan="6" class="empty-row">Belum ada pengguna.</td>
        </tr>
        <tr v-for="(user, idx) in rows" :key="user.id" :class="{ 'row-inactive': !user.is_active }">
          <td>{{ idx + 1 }}</td>
          <td class="col-name">
            {{ user.name }}
            <span v-if="isSelf(user)" class="self-tag">(Anda)</span>
          </td>
          <td class="col-username">{{ user.username }}</td>
          <td>
            <BaseBadge
              :text="ROLE_CONFIG[user.role]?.label ?? user.role"
              :variant="ROLE_CONFIG[user.role]?.variant ?? 'neutral'"
            />
          </td>
          <td class="text-center">
            <BaseBadge
              :text="user.is_active ? 'Aktif' : 'Nonaktif'"
              :variant="user.is_active ? 'success' : 'danger'"
            />
          </td>
          <td class="text-center col-aksi">
            <BaseButton
              v-if="!isSelf(user)"
              :label="user.is_active ? 'Nonaktifkan' : 'Aktifkan'"
              :variant="user.is_active ? 'danger' : 'success'"
              class="btn-sm"
              @click="$emit('toggle', user)"
            />
            <span v-else class="self-lock">—</span>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.table-wrapper { overflow-x: auto; }
.empty-row { text-align: center; padding: 32px; color: #9CA3AF; font-style: italic; }
.col-name     { min-width: 140px; }
.col-username { font-family: monospace; color: #374151; }
.col-aksi     { width: 130px; }
.row-inactive td { opacity: 0.55; }
.self-tag  { font-size: var(--text-label); color: #9CA3AF; margin-left: 4px; }
.self-lock { color: #D1D5DB; }
.btn-sm    { padding: 4px 10px !important; font-size: var(--text-label) !important; }
</style>
