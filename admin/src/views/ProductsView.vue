<script setup lang="ts">
import { onMounted, ref } from 'vue'
import axios from 'axios'

interface Product {
  id: string
  name: string
  category: { name: string }
  price?: { amountKop: number }
}

const products = ref<Product[]>([])

onMounted(async () => {
  const { data } = await axios.get('/api/admin/products', { withCredentials: true })
  products.value = data.products
})

function price(p: Product) {
  if (!p.price) return '—'
  return `${(p.price.amountKop / 100).toFixed(0)} ₽`
}
</script>

<template>
  <div>
    <div class="head">
      <h1>Номенклатура</h1>
      <RouterLink to="/products/new" class="btn">Добавить блюдо</RouterLink>
    </div>
    <table class="card">
      <thead><tr><th>Название</th><th>Категория</th><th>Цена</th><th></th></tr></thead>
      <tbody>
        <tr v-for="p in products" :key="p.id">
          <td>{{ p.name }}</td>
          <td>{{ p.category.name }}</td>
          <td>{{ price(p) }}</td>
          <td><RouterLink :to="`/products/${p.id}`">Редактировать</RouterLink></td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.head { display: flex; justify-content: space-between; align-items: center; gap: 16px; margin-bottom: 16px; }
</style>
