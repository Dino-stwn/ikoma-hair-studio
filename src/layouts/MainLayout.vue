<script setup>
import AppSidebar from '@/components/layout/AppSidebar.vue'
import AppTopbar  from '@/components/layout/AppTopbar.vue'
</script>

<!-- Layout utama untuk halaman yang sudah login -->
<template>
  <div class="main-layout">
    <AppSidebar class="main-layout__sidebar" />

    <div class="main-layout__body">
      <AppTopbar class="main-layout__topbar" />

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
  width: 220px;
  flex-shrink: 0;
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  z-index: 100;
}

/* Area kanan: topbar + konten */
.main-layout__body {
  margin-left: 220px;
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
</style>
