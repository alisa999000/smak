<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'

const route = useRoute()
const router = useRouter()
const isNew = computed(() => route.name === 'page-new')

const allPages = ref<Array<{ id: string; slug: string; pagetitle: string }>>([])
const form = ref({
  pagetitle: '',
  slug: '',
  longtitle: '',
  description: '',
  introtext: '',
  content: '',
  menuindex: 0,
  isfolder: false,
  published: true,
  parentSlug: '',
})

const parentOptions = computed(() =>
  allPages.value.filter((p) => isNew.value || p.id !== String(route.params.id)),
)

onMounted(async () => {
  const { data: listData } = await axios.get('/api/admin/pages', { withCredentials: true })
  allPages.value = listData.pages

  if (!isNew.value) {
    const { data } = await axios.get(`/api/admin/pages/${route.params.id}`, { withCredentials: true })
    const p = data.page
    form.value = {
      pagetitle: p.pagetitle,
      slug: p.slug,
      longtitle: p.longtitle ?? '',
      description: p.description ?? '',
      introtext: p.introtext ?? '',
      content: p.content ?? '',
      menuindex: p.menuindex ?? 0,
      isfolder: Boolean(p.isfolder),
      published: Boolean(p.published),
      parentSlug: p.parentSlug ?? '',
    }
  }
})

async function save() {
  const payload = {
    ...form.value,
    parentSlug: form.value.parentSlug || null,
  }
  if (isNew.value) {
    const { data } = await axios.post('/api/admin/pages', payload, { withCredentials: true })
    router.push(`/pages/${data.page.id}`)
  } else {
    await axios.put(`/api/admin/pages/${route.params.id}`, payload, { withCredentials: true })
    alert('Сохранено')
  }
}

async function remove() {
  if (!confirm('Удалить страницу?')) return
  try {
    await axios.delete(`/api/admin/pages/${route.params.id}`, { withCredentials: true })
    router.push('/pages')
  } catch {
    alert('Не удалось удалить')
  }
}

function previewUrl() {
  const slug = form.value.slug || 'page'
  return slug === 'menyu' ? '/menyu' : `/${slug}`
}
</script>

<template>
  <div>
    <div class="head">
      <h1>{{ isNew ? 'Новая страница' : 'Редактирование страницы' }}</h1>
      <a v-if="form.slug" :href="previewUrl()" target="_blank" rel="noopener" class="btn btn-outline">Открыть на сайте</a>
    </div>

    <form class="card form" @submit.prevent="save">
      <div class="grid2">
        <label>Заголовок (H1)<input v-model="form.pagetitle" required /></label>
        <label>URL (slug)<input v-model="form.slug" placeholder="o-kompanii" /></label>
      </div>

      <label>Длинный заголовок<input v-model="form.longtitle" /></label>
      <label>Описание (SEO)<input v-model="form.description" /></label>
      <label>Краткий текст (анонс)<textarea v-model="form.introtext" rows="2" /></label>
      <label>
        Содержимое (HTML)
        <textarea v-model="form.content" rows="16" class="content" placeholder="<p>Текст страницы...</p>" />
      </label>

      <div class="grid3">
        <label>Порядок в меню<input v-model.number="form.menuindex" type="number" /></label>
        <label>Родительская страница
          <select v-model="form.parentSlug">
            <option value="">— нет —</option>
            <option v-for="p in parentOptions" :key="p.id" :value="p.slug">{{ p.pagetitle }}</option>
          </select>
        </label>
        <div class="checks">
          <label class="check"><input v-model="form.published" type="checkbox" /> Опубликована</label>
          <label class="check"><input v-model="form.isfolder" type="checkbox" /> Раздел (папка)</label>
        </div>
      </div>

      <div class="actions">
        <button type="submit" class="btn">Сохранить</button>
        <RouterLink to="/pages" class="btn btn-outline">К списку</RouterLink>
        <button v-if="!isNew && form.slug !== 'menyu'" type="button" class="btn btn-danger" @click="remove">Удалить</button>
      </div>
    </form>
  </div>
</template>

<style scoped>
.head { display: flex; align-items: center; justify-content: space-between; gap: 16px; flex-wrap: wrap; margin-bottom: 16px; }
.form { display: flex; flex-direction: column; gap: 14px; margin-top: 8px; }
.grid2 { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
.grid3 { display: grid; grid-template-columns: 120px 1fr 1fr; gap: 14px; align-items: end; }
.content { font-family: ui-monospace, monospace; font-size: 13px; line-height: 1.5; }
.checks { display: flex; flex-direction: column; gap: 8px; padding-bottom: 8px; }
.check { display: flex; align-items: center; gap: 8px; width: auto; }
.check input { width: auto; }
.actions { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 8px; }
.btn-outline { background: transparent; border: 1px solid var(--line); color: var(--muted); text-decoration: none; }
.btn-danger { background: #d03b1d; }
@media (max-width: 768px) {
  .grid2, .grid3 { grid-template-columns: 1fr; }
}
</style>
