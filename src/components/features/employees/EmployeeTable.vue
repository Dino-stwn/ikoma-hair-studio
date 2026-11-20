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
        <tr v-if="rows.length === 0" class="tr-empty">
          <td colspan="6" class="empty-row">
            <div class="empty-cell">
              <span class="empty-icon">👥</span>
              <span>Belum ada pengguna.</span>
            </div>
          </td>
        </tr>
        <tr v-for="(user, idx) in rows" :key="user.id" :class="{ 'row-inactive': !user.is_active }">
          <td data-label="No">{{ idx + 1 }}</td>
          <td class="col-name" data-label="Nama">
            {{ user.name }}
            <span v-if="isSelf(user)" class="self-tag">(Anda)</span>
          </td>
          <td class="col-username" data-label="Username">{{ user.username }}</td>
          <td data-label="Role">
            <BaseBadge
              :text="ROLE_CONFIG[user.role]?.label ?? user.role"
              :variant="ROLE_CONFIG[user.role]?.variant ?? 'neutral'"
            />
          </td>
          <td class="text-center" data-label="Status">
            <BaseBadge
              :text="user.is_active ? 'Aktif' : 'Nonaktif'"
              :variant="user.is_active ? 'success' : 'danger'"
            />
          </td>
          <td class="text-center col-aksi" data-label="Aksi">
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
.empty-row { text-align: center; padding: 48px 24px; color: #9CA3AF; }
.empty-cell { display: flex; flex-direction: column; align-items: center; gap: 8px; }
.empty-icon { font-size: 28px; }
.col-name     { min-width: 140px; font-weight: 600; color: var(--color-secondary); }
.col-username { font-family: monospace; color: #374151; }
.col-aksi     { width: 130px; }
.row-inactive td { opacity: 0.55; }
.self-tag  { font-size: var(--text-label); color: #9CA3AF; margin-left: 4px; }
.self-lock { color: #D1D5DB; }
.btn-sm    { padding: 5px 12px !important; font-size: var(--text-label) !important; border-radius: 8px !important; }

@media (max-width: 640px) {
  .table, thead, tbody, tr, th, td { display: block; }
  thead tr { display: none; }
  tbody tr:not(.tr-empty) {
    background: var(--color-surface);
    border: 1px solid #F3F4F6;
    border-radius: var(--radius-card);
    margin-bottom: 12px;
    padding: 14px 16px;
    box-shadow: var(--shadow-sm);
  }
  tbody tr:not(.tr-empty) td {
    padding: 6px 0; border: none; display: flex;
    align-items: center; justify-content: space-between;
    gap: 8px; font-size: var(--text-body);
  }
  tbody tr:not(.tr-empty) td::before {
    content: attr(data-label); font-size: var(--text-label);
    font-weight: 600; color: #6B7280; text-transform: uppercase; letter-spacing: 0.3px;
  }
  .col-aksi { width: 100%; margin-top: 6px; padding-top: 8px; border-top: 1px solid #F3F4F6 !important; }
}
</style>
