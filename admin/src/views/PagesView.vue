<script setup lang="ts">
import { onMounted, ref } from 'vue'
import axios from 'axios'

interface PageRow {
  id: string
  slug: string
  pagetitle: string
  published: boolean
  menuindex: number
}

const pages = ref<PageRow[]>([])
const error = ref('')

async function load() {
  const { data } = await axios.get('/api/admin/pages', { withCredentials: true })
  pages.value = data.pages
}

async function remove(id: string, title: string) {
  if (!confirm(`Удалить страницу «${title}»?`)) return
  try {
    await axios.delete(`/api/admin/pages/${id}`, { withCredentials: true })
    await load()
  } catch {
    alert('Не удалось удалить (возможно, защищённая страница)')
  }
}

function publicUrl(slug: string) {
  if (slug === 'menyu') return '/menyu'
  return `/${slug}`
}

onMounted(load)
</script>

<template>
  <div>
    <div class="head">
      <h1>Страницы сайта</h1>
      <RouterLink to="/pages/new" class="btn">Новая страница</RouterLink>
    </div>
    <p class="muted">Редактируйте тексты разделов: «О компании», FAQ, акции и любые новые страницы. Контент — HTML.</p>
    <p v-if="error" class="error">{{ error }}</p>
    <table class="card mt">
      <thead>
        <tr>
          <th>Заголовок</th>
          <th>URL</th>
          <th>Статус</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="p in pages" :key="p.id">
          <td>
            <RouterLink :to="`/pages/${p.id}`">{{ p.pagetitle }}</RouterLink>
          </td>
          <td>
            <a :href="publicUrl(p.slug)" target="_blank" rel="noopener">{{ publicUrl(p.slug) }}</a>
          </td>
          <td>
            <span :class="p.published ? 'badge ok' : 'badge draft'">{{ p.published ? 'Опубликована' : 'Черновик' }}</span>
          </td>
          <td class="actions">
            <RouterLink :to="`/pages/${p.id}`" class="btn btn-outline btn-sm">Изменить</RouterLink>
            <button v-if="p.slug !== 'menyu'" type="button" class="btn btn-outline btn-sm" @click="remove(p.id, p.pagetitle)">Удалить</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.head { display: flex; align-items: center; justify-content: space-between; gap: 16px; flex-wrap: wrap; }
.muted { color: var(--muted); margin-top: 8px; }
.mt { margin-top: 20px; padding: 0; overflow: hidden; }
.error { color: #d03b1d; }
.actions { display: flex; gap: 8px; white-space: nowrap; }
.btn-sm { padding: 6px 12px; font-size: 13px; }
.btn-outline { background: transparent; border: 1px solid var(--line); color: var(--muted); }
.badge { font-size: 12px; padding: 4px 10px; border-radius: 999px; }
.badge.ok { background: #e8f5e0; color: var(--accent); }
.badge.draft { background: var(--chip); color: var(--muted); }
</style>
