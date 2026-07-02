<script setup lang="ts">
import { onMounted, ref } from 'vue'
import axios from 'axios'

const stats = ref({ categories: 0, products: 0, weekly: 0, priced: 0 })

onMounted(async () => {
  const { data } = await axios.get('/api/admin/stats', { withCredentials: true })
  stats.value = data
})
</script>

<template>
  <div class="space-y">
    <div>
      <h1>Обзор</h1>
      <p class="muted">Мини-CRM для меню: номенклатура, неделя, API для сайта</p>
    </div>
    <div class="grid">
      <RouterLink to="/categories" class="card stat"><p>Категории</p><strong>{{ stats.categories }}</strong></RouterLink>
      <RouterLink to="/products" class="card stat"><p>Позиции</p><strong>{{ stats.products }}</strong></RouterLink>
      <RouterLink to="/weekly" class="card stat"><p>Слоты в неделе</p><strong>{{ stats.weekly }}</strong></RouterLink>
      <RouterLink to="/products" class="card stat"><p>Цены заданы</p><strong>{{ stats.priced }}</strong></RouterLink>
    </div>
  </div>
</template>

<style scoped>
.space-y { display: grid; gap: 24px; }
.muted { color: var(--muted); }
.grid { display: grid; gap: 16px; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); }
.stat { text-decoration: none; color: inherit; transition: border-color .2s; }
.stat:hover { border-color: var(--accent); }
.stat p { margin: 0 0 8px; color: var(--muted); font-size: 14px; }
.stat strong { font-size: 28px; }
</style>
