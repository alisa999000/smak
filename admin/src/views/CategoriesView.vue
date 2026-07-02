<script setup lang="ts">
import { onMounted, ref } from 'vue'
import axios from 'axios'

interface Category { id: string; name: string; sortOrder: number }
const categories = ref<Category[]>([])
const name = ref('')
const error = ref('')

async function load() {
  const { data } = await axios.get('/api/admin/categories', { withCredentials: true })
  categories.value = data.categories
}

async function create() {
  error.value = ''
  try {
    await axios.post('/api/admin/categories', { name: name.value }, { withCredentials: true })
    name.value = ''
    await load()
  } catch {
    error.value = 'Не удалось создать категорию'
  }
}

async function remove(id: string) {
  if (!confirm('Удалить категорию?')) return
  try {
    await axios.delete(`/api/admin/categories/${id}`, { withCredentials: true })
    await load()
  } catch {
    alert('Нельзя удалить: есть продукты')
  }
}

onMounted(load)
</script>

<template>
  <div>
    <h1>Категории</h1>
    <form class="card form-row" @submit.prevent="create">
      <input v-model="name" placeholder="Название категории" required />
      <button type="submit" class="btn">Добавить</button>
    </form>
    <p v-if="error" class="error">{{ error }}</p>
    <table class="card mt">
      <thead><tr><th>Название</th><th></th></tr></thead>
      <tbody>
        <tr v-for="c in categories" :key="c.id">
          <td>{{ c.name }}</td>
          <td><button type="button" class="btn btn-outline" @click="remove(c.id)">Удалить</button></td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.form-row { display: flex; gap: 12px; margin-top: 16px; }
.mt { margin-top: 16px; padding: 0; overflow: hidden; }
.error { color: #d03b1d; }
</style>
