<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import CatalogPageLayout from '@/components/catalog/CatalogPageLayout.vue'
import ProductCard from '@/components/catalog/ProductCard.vue'
import MenuDownloadButton from '@/components/menu/MenuDownloadButton.vue'
import { fetchMenuDayProducts, fetchPage } from '@/api/client'
import { formatDateAjax, formatDateShort, weekDates } from '@/utils/dates'
import type { SiteDocument } from '@/types/site'

const props = defineProps<{ alias?: string }>()
const route = useRoute()

const dates = weekDates()
const selectedIndex = ref(2)
const loading = ref(true)
const error = ref('')
const section = ref<SiteDocument | null>(null)
const products = ref<SiteDocument[]>([])

let loadSeq = 0

const breadcrumbItems = computed(() => section.value?.breadcrumbs)

const routeSegment = computed(() => {
  const fromRoute = route.params.section
  if (typeof fromRoute === 'string' && fromRoute.length > 0) return fromRoute
  if (props.alias && props.alias !== 'menyu') return props.alias
  return ''
})

const categoryTitle = computed(() => {
  if (!routeSegment.value && section.value?.alias === 'menyu') return undefined
  return section.value?.isfolder ? section.value.pagetitle : undefined
})

const selectedDate = computed(() => dates[selectedIndex.value])

async function loadSection() {
  const segment = routeSegment.value
  const pageAlias = segment || 'menyu'
  try {
    section.value = await fetchPage(pageAlias)
    error.value = ''
  } catch (e) {
    section.value = null
    error.value = 'Не удалось загрузить раздел. Убедитесь, что запущен backend (npm run dev в menu-crm).'
    console.error(e)
  }
}

async function loadProducts() {
  const seq = ++loadSeq
  loading.value = true
  products.value = []

  try {
    if (!section.value) {
      await loadSection()
    }
    if (seq !== loadSeq || !section.value) return

    const date = formatDateAjax(dates[selectedIndex.value])
    products.value = await fetchMenuDayProducts(date, routeSegment.value || undefined)
  } catch (e) {
    if (seq !== loadSeq) return
    products.value = []
    error.value = 'Не удалось загрузить меню на выбранный день.'
    console.error(e)
  } finally {
    if (seq === loadSeq) loading.value = false
  }
}

function selectDay(index: number) {
  selectedIndex.value = index
  loadProducts()
}

watch(
  () => [route.path, props.alias] as const,
  async () => {
    section.value = null
    await loadSection()
    await loadProducts()
  },
  { immediate: true },
)
</script>

<template>
  <CatalogPageLayout
    :title="section?.pagetitle ?? 'Меню'"
    :items="breadcrumbItems"
  >
    <div v-if="error && !section" class="catalog-state">{{ error }}</div>

    <template v-else-if="section">
      <div class="data_day">
        <div id="dates">
          <div
            v-for="(date, i) in dates"
            :key="i"
            class="date"
            :class="{ selected: i === selectedIndex }"
            @click="selectDay(i)"
          >
            {{ formatDateShort(date) }}<template v-if="i === 2"> (завтра)</template>
          </div>
        </div>
        <MenuDownloadButton :date="selectedDate" />
      </div>

      <div v-if="loading" class="catalog-state">Загрузка…</div>

      <div v-else-if="products.length" class="catalog-products">
        <div class="row produkt_day">
          <ProductCard
            v-for="p in products"
            :key="p.id"
            :product="p"
            :parent-title="categoryTitle"
            hide-image
            dense
          />
        </div>
      </div>

      <div v-else class="catalog-state">
        <template v-if="routeSegment">
          В категории «{{ section.pagetitle }}» на выбранный день блюд нет.
        </template>
        <template v-else>
          На выбранный день блюд нет.
        </template>
      </div>
    </template>

    <div v-else class="catalog-state">Раздел не найден.</div>
  </CatalogPageLayout>
</template>
