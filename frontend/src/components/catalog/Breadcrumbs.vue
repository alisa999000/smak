<script setup lang="ts">
import type { Breadcrumb } from '@/types/site'

defineProps<{ items: Breadcrumb[] }>()
</script>

<template>
  <nav itemscope itemtype="https://schema.org/BreadcrumbList">
    <ul class="breadcrumps mb40" itemprop="itemListElement">
      <li v-for="(crumb, i) in items" :key="crumb.id" itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem" :class="{ active: i === items.length - 1 }">
        <RouterLink v-if="i < items.length - 1" itemprop="item" :to="crumb.url.replace(/\.html$/, '')">
          <span itemprop="name">{{ crumb.pagetitle }}</span>
        </RouterLink>
        <span v-else itemprop="name">{{ crumb.pagetitle }}</span>
      </li>
    </ul>
  </nav>
</template>
