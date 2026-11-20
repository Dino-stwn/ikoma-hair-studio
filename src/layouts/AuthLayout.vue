<!-- Layout untuk halaman publik (login, dsb.) — tanpa sidebar -->
<template>
  <div class="auth-layout">
    <div class="auth-bg-deco" aria-hidden="true" />
    <slot />
  </div>
</template>

<style scoped>
.auth-layout {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #1F2937 0%, #111827 60%, #0F172A 100%);
  padding: 24px;
  position: relative;
  overflow: hidden;
}

.auth-bg-deco {
  position: absolute;
  top: -120px;
  right: -120px;
  width: 420px;
  height: 420px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(201, 162, 39, 0.15) 0%, transparent 70%);
  pointer-events: none;
}
</style>
