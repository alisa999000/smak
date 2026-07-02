<script setup lang="ts">
import { computed } from 'vue'
import CatalogSidebar from '@/components/catalog/CatalogSidebar.vue'
import type { Breadcrumb } from '@/types/site'

export interface PageCrumb {
  label: string
  to: string
}

const props = defineProps<{
  title: string
  parents?: PageCrumb[]
  items?: Breadcrumb[]
}>()

const trail = computed(() => {
  if (props.items?.length) {
    const rows: { label: string; to: string; active: boolean }[] = [
      { label: 'Главная', to: '/', active: false },
    ]
    props.items.forEach((item, i) => {
      const isLast = i === props.items!.length - 1
      rows.push({
        label: item.pagetitle,
        to: isLast ? '' : item.url.replace(/\.html$/, ''),
        active: isLast,
      })
    })
    return rows
  }

  const rows: { label: string; to: string; active: boolean }[] = [
    { label: 'Главная', to: '/', active: false },
  ]
  props.parents?.forEach((p) => rows.push({ label: p.label, to: p.to, active: false }))
  rows.push({ label: props.title, to: '', active: true })
  return rows
})
</script>

<template>
  <div class="page-layout catalog_page">
    <div class="container">
      <div class="row row_lg hleb-cab">
        <div class="col-lg-12">
          <nav itemscope itemtype="https://schema.org/BreadcrumbList">
            <ul class="breadcrumps mb40">
              <li
                v-for="(crumb, i) in trail"
                :key="`${crumb.label}-${i}`"
                itemprop="itemListElement"
                itemscope
                itemtype="https://schema.org/ListItem"
                :class="{ active: crumb.active }"
              >
                <RouterLink v-if="!crumb.active && crumb.to" itemprop="item" :to="crumb.to">
                  <span itemprop="name">{{ crumb.label }}</span>
                </RouterLink>
                <span v-else itemprop="name">{{ crumb.label }}</span>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      <div class="row row_lg catalog-page__body" id="main_section">
        <div class="col-lg-2 col-md-12">
          <CatalogSidebar />
        </div>
        <div class="col-lg-10 col-md-12">
          <h1 class="main_h1 tit-main">{{ title }}</h1>
          <slot />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.catalog-page__body {
  align-items: flex-start;
}

.catalog-page__body .main_h1 {
  margin-bottom: 28px;
}
</style>
