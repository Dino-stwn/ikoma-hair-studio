<!-- Layout utama untuk halaman yang sudah login -->
<script setup>
import { ref } from 'vue'
import AppSidebar from '@/components/layout/AppSidebar.vue'
import AppTopbar  from '@/components/layout/AppTopbar.vue'
import BaseIcon   from '@/components/common/BaseIcon.vue'

const sidebarOpen = ref(false)
</script>

<template>
  <div class="main-layout">
    <!-- Overlay mobile -->
    <div v-if="sidebarOpen" class="sidebar-overlay" @click="sidebarOpen = false" />

    <AppSidebar
      class="main-layout__sidebar"
      :class="{ 'sidebar--open': sidebarOpen }"
    />

    <div class="main-layout__body">
      <AppTopbar class="main-layout__topbar">
        <button
          class="menu-toggle"
          aria-label="Buka menu"
          @click="sidebarOpen = !sidebarOpen"
        >
          <BaseIcon :name="sidebarOpen ? 'close' : 'menu'" :size="20" />
        </button>
      </AppTopbar>

      <main class="main-layout__content">
        <slot />
      </main>
    </div>
  </div>
</template>

<style scoped>
.main-layout {
  display: flex;
  min-height: 100vh;
}

/* Sidebar tetap di kiri */
.main-layout__sidebar {
  width: 240px;
  flex-shrink: 0;
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  z-index: 100;
  transition: transform var(--transition-base);
}

/* Area kanan: topbar + konten */
.main-layout__body {
  margin-left: 240px;
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: var(--color-bg);
}

.main-layout__topbar {
  position: sticky;
  top: 0;
  z-index: 90;
}

.main-layout__content {
  flex: 1;
  padding: 28px 32px;
}

.sidebar-overlay { display: none; }
.menu-toggle    { display: none; }

/* ── Responsif mobile ── */
@media (max-width: 768px) {
  .main-layout__sidebar {
    transform: translateX(-100%);
  }
  .main-layout__sidebar.sidebar--open {
    transform: translateX(0);
  }
  .main-layout__body {
    margin-left: 0;
  }
  .main-layout__content {
    padding: 20px 16px;
  }
  .sidebar-overlay {
    display: block;
    position: fixed;
    inset: 0;
    background: rgba(17, 24, 39, 0.5);
    z-index: 99;
    backdrop-filter: blur(2px);
  }
  .menu-toggle {
    display: flex;
    align-items: center;
    justify-content: center;
    background: none;
    border: none;
    cursor: pointer;
    padding: 6px;
    border-radius: var(--radius-btn);
    margin-right: 4px;
    color: var(--color-text);
    transition: background var(--transition-fast);
  }
  .menu-toggle:hover {
    background: #F3F4F6;
  }
}
</style>
