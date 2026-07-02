<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import PageLayout from '@/components/layout/PageLayout.vue'
import { searchProducts } from '@/api/client'
import ProductCard from '@/components/catalog/ProductCard.vue'
import type { SiteDocument } from '@/types/site'

const route = useRoute()
const q = ref(String(route.query.q ?? ''))
const results = ref<SiteDocument[]>([])

async function run() {
  if (!q.value.trim()) return
  results.value = await searchProducts(q.value.trim())
}

onMounted(run)
</script>

<template>
  <PageLayout title="Результаты поиска">
    <form class="mb-4" @submit.prevent="run">
      <input v-model="q" class="input-dat" type="search" placeholder="Поиск..." />
      <button type="submit" class="submits">Найти</button>
    </form>
    <div class="row produkt_day">
      <ProductCard v-for="p in results" :key="p.id" :product="p" />
      <div v-if="q && !results.length" class="col-12">Ничего не найдено</div>
    </div>
  </PageLayout>
</template>
