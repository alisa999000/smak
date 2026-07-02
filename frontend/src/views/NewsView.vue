<script setup lang="ts">
import { onMounted, ref } from 'vue'
import PageLayout from '@/components/layout/PageLayout.vue'
import { fetchNews } from '@/api/client'
import type { SiteDocument } from '@/types/site'

const items = ref<SiteDocument[]>([])
onMounted(async () => { items.value = await fetchNews() })
</script>

<template>
  <PageLayout title="Новости">
    <div class="row">
      <div v-for="n in items" :key="n.id" class="col-md-4 mb-4">
        <RouterLink :to="`/novosti/${n.alias}`">
          <h3>{{ n.pagetitle }}</h3>
          <p>{{ n.introtext }}</p>
        </RouterLink>
      </div>
    </div>
  </PageLayout>
</template>
