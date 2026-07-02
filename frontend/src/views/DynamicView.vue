<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import PageLayout from '@/components/layout/PageLayout.vue'
import { fetchPage, fetchProduct } from '@/api/client'
import ProductView from '@/views/ProductView.vue'
import CatalogView from '@/views/CatalogView.vue'
import NotFoundView from '@/views/NotFoundView.vue'
import type { SiteDocument } from '@/types/site'

const route = useRoute()
const mode = ref<'loading' | 'product' | 'section' | 'page' | '404'>('loading')
const alias = ref('')
const page = ref<SiteDocument | null>(null)

watch(() => route.params.alias, load, { immediate: true })

async function load() {
  const a = String(route.params.alias ?? '')
  alias.value = a
  mode.value = 'loading'
  page.value = null
  try {
    const product = await fetchProduct(a)
    if (product && !product.isfolder) {
      mode.value = 'product'
      return
    }
  } catch { /* not product */ }
  try {
    const doc = await fetchPage(a)
    if (doc?.isfolder) {
      mode.value = 'section'
      return
    }
    if (doc) {
      page.value = doc
      mode.value = 'page'
      return
    }
  } catch { /* not page */ }
  mode.value = '404'
}

onMounted(load)
</script>

<template>
  <div v-if="mode === 'loading'" class="page-layout"><div class="container py-5"><p>Загрузка…</p></div></div>
  <ProductView v-else-if="mode === 'product'" :alias="alias" />
  <CatalogView v-else-if="mode === 'section'" :alias="alias" />
  <PageLayout
    v-else-if="mode === 'page' && page"
    :title="page.pagetitle"
    :items="page.breadcrumbs?.length ? page.breadcrumbs : undefined"
  >
    <div class="page-content" v-html="page.content" />
  </PageLayout>
  <NotFoundView v-else />
</template>
