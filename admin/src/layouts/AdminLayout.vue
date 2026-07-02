<script setup lang="ts">
const nav = [
  { to: '/dashboard', label: 'Обзор' },
  { to: '/categories', label: 'Категории' },
  { to: '/products', label: 'Номенклатура' },
  { to: '/weekly', label: 'Меню недели' },
  { to: '/pages', label: 'Страницы' },
  { to: '/import/menu', label: 'Импорт Excel' },
  { to: '/import/iiko', label: 'Импорт iiko' },
  { to: '/export', label: 'Выгрузка / API' },
]

async function logout() {
  await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' })
  window.location.href = '/admin/login'
}
</script>

<template>
  <div class="admin-shell">
    <header class="admin-header">
      <RouterLink to="/dashboard" class="brand">Смачная <span>· меню</span></RouterLink>
      <nav>
        <RouterLink v-for="item in nav" :key="item.to" :to="item.to">{{ item.label }}</RouterLink>
      </nav>
      <button type="button" class="btn btn-outline" @click="logout">Выйти</button>
    </header>
    <main class="admin-main">
      <slot />
    </main>
  </div>
</template>

<style scoped>
.admin-shell { min-height: 100vh; }
.admin-header {
  display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 16px;
  padding: 16px 24px; background: var(--surface); border-bottom: 1px solid var(--line);
}
.brand { font-weight: 600; text-decoration: none; color: var(--ink); }
.brand span { color: var(--muted); font-weight: 400; }
nav { display: flex; flex-wrap: wrap; gap: 8px; }
nav a { text-decoration: none; color: var(--ink); padding: 6px 12px; border-radius: 999px; }
nav a.router-link-active { background: var(--chip); color: var(--accent); }
.admin-main { max-width: 1100px; margin: 0 auto; padding: 32px 24px; }
.btn-outline { background: transparent; border: 1px solid var(--line); color: var(--muted); }
</style>
