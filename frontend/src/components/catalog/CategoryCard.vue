<script setup lang="ts">
import type { SiteDocument } from '@/types/site'
import { docRoute } from '@/utils/catalog'

defineProps<{ category: SiteDocument }>()
</script>

<template>
  <div class="col-md-6 col-lg-3">
    <RouterLink :to="docRoute(category.url)" class="catalog-category">
      <span class="catalog-category__title">{{ category.pagetitle }}</span>
      <span class="catalog-category__arrow" aria-hidden="true">→</span>
    </RouterLink>
  </div>
</template>
