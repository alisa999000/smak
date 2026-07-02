<script setup lang="ts">
import { computed } from 'vue'
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
  <div class="page-layout">
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
      <h1 class="tit-main">{{ title }}</h1>
      <slot />
    </div>
  </div>
</template>
