<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import PageLayout from '@/components/layout/PageLayout.vue'
import { fetchNewsItem } from '@/api/client'
import type { SiteDocument } from '@/types/site'

const route = useRoute()
const news = ref<SiteDocument | null>(null)

const parents = [{ label: 'Новости', to: '/novosti' }]

const breadcrumbItems = computed(() =>
  news.value?.breadcrumbs?.length ? news.value.breadcrumbs : undefined,
)

async function load() {
  news.value = await fetchNewsItem(String(route.params.alias))
}

watch(() => route.params.alias, load, { immediate: true })
onMounted(load)
</script>

<template>
  <PageLayout
    v-if="news"
    :title="news.pagetitle"
    :items="breadcrumbItems"
    :parents="breadcrumbItems ? undefined : parents"
  >
    <div class="page-content" v-html="news.content" />
  </PageLayout>
</template>
