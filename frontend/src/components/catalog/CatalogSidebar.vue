<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { fetchCategories } from '@/api/client'
import { docRoute } from '@/utils/catalog'
import type { SiteDocument } from '@/types/site'

const categories = ref<SiteDocument[]>([])
const route = useRoute()

const activeSlug = computed(() => {
  const section = route.params.section
  return typeof section === 'string' ? section : ''
})

onMounted(async () => {
  try {
    categories.value = await fetchCategories(2)
  } catch {
    categories.value = []
  }
})
</script>

<template>
  <aside class="catalog-sidebar left_menu">
    <div class="item_top_menu catalog-sidebar__promo">
      <RouterLink to="/akcii" class="item_top_link" />
      <div class="item_top_title red">
        Акции
        <img src="/assets/images/discount.png" alt="" />
      </div>
    </div>

    <div
      v-for="cat in categories"
      :key="cat.id"
      class="item_top_menu"
    >
      <RouterLink :to="docRoute(cat.url)" class="item_top_link" />
      <div class="item_top_title" :class="{ red: activeSlug === cat.alias }">
        {{ cat.pagetitle }}
      </div>
    </div>
  </aside>
</template>

<style scoped>
.catalog-sidebar {
  position: sticky;
  top: 88px;
}

.catalog-sidebar__promo {
  margin-bottom: 20px;
  padding-bottom: 20px;
  border-bottom: 1px solid #ececec;
}

.catalog-sidebar .item_top_title {
  font-family: Inter, sans-serif;
  font-size: 16px;
  font-weight: 500;
  line-height: 1.35;
  color: #2c2724;
  position: relative;
  z-index: 1;
  pointer-events: none;
}

.catalog-sidebar .item_top_title.red {
  display: flex;
  align-items: center;
  color: #517b39;
  font-weight: 600;
}

@media (max-width: 991px) {
  .catalog-sidebar {
    position: static;
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-bottom: 24px;
  }

  .catalog-sidebar__promo {
    width: 100%;
    margin-bottom: 8px;
    padding-bottom: 12px;
  }

  .catalog-sidebar .item_top_menu {
    margin-bottom: 0;
    flex: 1 1 auto;
    min-width: 140px;
  }
}
</style>
