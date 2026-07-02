<script setup lang="ts">
import { onMounted, ref } from 'vue'
import PageLayout from '@/components/layout/PageLayout.vue'
import { fetchPage } from '@/api/client'
import type { SiteDocument } from '@/types/site'

const page = ref<SiteDocument | null>(null)
onMounted(async () => { page.value = await fetchPage('company') })
</script>

<template>
  <PageLayout :title="page?.pagetitle ?? 'О компании'">
    <div v-if="page" class="page-content" v-html="page.content" />
  </PageLayout>
</template>
