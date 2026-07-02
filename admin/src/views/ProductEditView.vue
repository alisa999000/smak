<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'
import ImageUpload from '@/components/ImageUpload.vue'

type ProductImageRow = { id: string; path: string; sortOrder: number }

const route = useRoute()
const router = useRouter()
const isNew = computed(() => route.name === 'product-new')

const categories = ref<Array<{ id: string; name: string }>>([])
const images = ref<ProductImageRow[]>([])
const newImagePath = ref('')
const form = ref({
  name: '',
  sku: '',
  categoryId: '',
  description: '',
  composition: '',
  weightGrams: '',
  priceRub: '',
  defaultInMenuDaily: false,
})

onMounted(async () => {
  const { data: catData } = await axios.get('/api/admin/categories', { withCredentials: true })
  categories.value = catData.categories
  if (!isNew.value) {
    const { data } = await axios.get(`/api/admin/products/${route.params.id}`, { withCredentials: true })
    const p = data.product
    images.value = p.images ?? []
    form.value = {
      name: p.name,
      sku: p.sku ?? '',
      categoryId: p.categoryId,
      description: p.description ?? '',
      composition: p.composition ?? '',
      weightGrams: p.weightGrams != null ? String(p.weightGrams) : '',
      priceRub: p.price ? String(p.price.amountKop / 100) : '',
      defaultInMenuDaily: p.defaultInMenuDaily,
    }
  }
})

async function save() {
  const payload = {
    ...form.value,
    weightGrams: form.value.weightGrams ? Number(form.value.weightGrams) : null,
    priceRub: form.value.priceRub ? Number(form.value.priceRub) : null,
    imagePath: newImagePath.value || undefined,
  }
  if (isNew.value) {
    const { data } = await axios.post('/api/admin/products', payload, { withCredentials: true })
    router.push(`/products/${data.product.id}`)
  } else {
    const { data } = await axios.put(`/api/admin/products/${route.params.id}`, payload, { withCredentials: true })
    images.value = data.product.images ?? []
    newImagePath.value = ''
    alert('Сохранено')
  }
}

async function removeImage(imageId: string) {
  if (!confirm('Удалить фото?')) return
  await axios.delete(`/api/admin/products/${route.params.id}/images/${imageId}`, { withCredentials: true })
  images.value = images.value.filter((img) => img.id !== imageId)
}

async function remove() {
  if (!confirm('Удалить блюдо?')) return
  await axios.delete(`/api/admin/products/${route.params.id}`, { withCredentials: true })
  router.push('/products')
}
</script>

<template>
  <div>
    <h1>{{ isNew ? 'Новое блюдо' : 'Редактирование' }}</h1>
    <form class="card form" @submit.prevent="save">
      <label>Название<input v-model="form.name" required /></label>
      <label>SKU<input v-model="form.sku" /></label>
      <label>Категория
        <select v-model="form.categoryId" required>
          <option value="">—</option>
          <option v-for="c in categories" :key="c.id" :value="c.id">{{ c.name }}</option>
        </select>
      </label>
      <label>Описание<textarea v-model="form.description" rows="3" /></label>
      <label>Состав<textarea v-model="form.composition" rows="3" /></label>
      <label>Вес (г)<input v-model="form.weightGrams" type="number" /></label>
      <label>Цена (₽)<input v-model="form.priceRub" type="number" step="0.01" /></label>
      <label class="check"><input v-model="form.defaultInMenuDaily" type="checkbox" /> Каждый день в меню</label>

      <div class="photos">
        <p class="photos__title">Фото блюда</p>
        <p class="photos__hint">JPEG, PNG или WebP до 5 МБ. Файл загружается на сервер, не в base64.</p>
        <ImageUpload v-model="newImagePath" />
        <ul v-if="images.length" class="photos__list">
          <li v-for="img in images" :key="img.id" class="photos__item">
            <img :src="img.path" alt="" />
            <button type="button" class="photos__remove" @click="removeImage(img.id)">Удалить</button>
          </li>
        </ul>
      </div>

      <div class="actions">
        <button type="submit" class="btn">Сохранить</button>
        <button v-if="!isNew" type="button" class="btn btn-outline" @click="remove">Удалить</button>
      </div>
    </form>
  </div>
</template>

<style scoped>
.form { display: grid; gap: 12px; max-width: 640px; margin-top: 16px; }
label { display: grid; gap: 6px; font-size: 14px; }
.check { display: flex; align-items: center; gap: 8px; }
.actions { display: flex; gap: 12px; margin-top: 8px; }
.photos { display: grid; gap: 10px; padding-top: 8px; border-top: 1px solid #ececec; }
.photos__title { margin: 0; font-size: 14px; font-weight: 600; }
.photos__hint { margin: 0; font-size: 13px; color: #6b6560; }
.photos__list { list-style: none; margin: 0; padding: 0; display: flex; flex-wrap: wrap; gap: 12px; }
.photos__item { display: grid; gap: 6px; }
.photos__item img { width: 96px; height: 96px; object-fit: cover; border-radius: 12px; border: 1px solid #e8e2da; }
.photos__remove { border: 0; background: none; color: #b42318; font-size: 12px; cursor: pointer; padding: 0; text-decoration: underline; }
</style>
