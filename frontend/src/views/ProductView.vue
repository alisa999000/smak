<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import CatalogPageLayout from '@/components/catalog/CatalogPageLayout.vue'
import ProductImage from '@/components/catalog/ProductImage.vue'
import { fetchProduct } from '@/api/client'
import { formatPrice } from '@/utils/dates'
import type { SiteDocument } from '@/types/site'

const props = defineProps<{ alias?: string }>()
const route = useRoute()

const loading = ref(true)
const error = ref('')
const product = ref<SiteDocument | null>(null)

const productAlias = computed(() => {
  if (props.alias) return props.alias
  const fromRoute = route.params.product
  return typeof fromRoute === 'string' ? fromRoute : ''
})

async function load() {
  const alias = productAlias.value
  if (!alias) {
    product.value = null
    loading.value = false
    return
  }

  loading.value = true
  error.value = ''
  try {
    product.value = await fetchProduct(alias)
  } catch {
    product.value = null
    error.value = 'Блюдо не найдено'
  } finally {
    loading.value = false
  }
}

watch(productAlias, load, { immediate: true })
</script>

<template>
  <CatalogPageLayout
    v-if="loading"
    title="Загрузка…"
  >
    <p class="catalog-state">Загрузка…</p>
  </CatalogPageLayout>

  <CatalogPageLayout
    v-else-if="error"
    title="Блюдо"
  >
    <p class="catalog-state">{{ error }}</p>
  </CatalogPageLayout>

  <CatalogPageLayout
    v-else-if="product"
    :title="product.pagetitle"
    :items="product.breadcrumbs?.length ? product.breadcrumbs : undefined"
  >
    <div class="row product-page">
      <div class="col-md-6">
        <ProductImage :src="product.tvs.image" :alt="product.pagetitle" variant="page" />
      </div>
      <div class="col-md-6 product-page__info">
        <p v-if="product.tvs.sostav" class="product-page__desc">{{ product.tvs.sostav }}</p>
        <div class="item_produkt_price product-page__price">{{ formatPrice(product.tvs.price) }}</div>
        <p v-if="product.tvs.massa" class="product-page__weight">{{ product.tvs.massa }} г</p>
      </div>
    </div>
  </CatalogPageLayout>
</template>

<style scoped>
.product-page__info {
  padding-top: 8px;
}

.product-page__desc {
  font-size: 16px;
  line-height: 1.55;
  margin-bottom: 20px;
}

.product-page__price {
  font-size: 28px;
  margin-bottom: 8px;
}

.product-page__weight {
  color: var(--site-muted);
  margin-bottom: 24px;
}
</style>
