<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useSiteStore } from '@/stores/site'
import { fetchCategories } from '@/api/client'
import {
  DEFAULT_HOURS,
  DEFAULT_ORDER_DEADLINE,
  DEFAULT_PHONE,
  DEFAULT_PHONE_TEL,
  HEADER_NAV,
  ORDER_SYSTEM_URL,
} from '@/data/siteDefaults'
import type { SiteDocument } from '@/types/site'

const site = useSiteStore()
const route = useRoute()

const panelOpen = ref(false)
const categories = ref<SiteDocument[]>([])

const phone = computed(() => site.config?.phone ?? DEFAULT_PHONE)
const phoneTel = computed(() => {
  const digits = phone.value.replace(/\D/g, '')
  return digits.length >= 10 ? digits : DEFAULT_PHONE_TEL
})
const hoursLine = computed(() => site.config?.hours ?? DEFAULT_HOURS)
const orderSystemUrl = computed(() => site.config?.orderSystemUrl ?? ORDER_SYSTEM_URL)

const metaLine = computed(() => `Санкт-Петербург · ${hoursLine.value} · ${DEFAULT_ORDER_DEADLINE}`)

onMounted(async () => {
  await site.loadConfig()
  try {
    categories.value = await fetchCategories(2)
  } catch {
    categories.value = []
  }
})

function togglePanel() {
  panelOpen.value = !panelOpen.value
  document.body.classList.toggle('no-scroll', panelOpen.value)
}

function closePanel() {
  panelOpen.value = false
  document.body.classList.remove('no-scroll')
}

function isActive(path: string) {
  if (path === '/menyu') {
    return route.path === '/menyu' || route.path.startsWith('/menyu/')
  }
  return route.path === path || route.path.startsWith(`${path}/`)
}
</script>

<template>
  <header class="site-header">
    <div class="container">
      <div class="site-header__card">
        <div class="site-header__row">
          <RouterLink to="/" class="site-header__logo">
            <img src="/image/logo.png" alt="Смачная точка" />
          </RouterLink>

          <nav class="site-header__nav" aria-label="Меню сайта">
            <RouterLink
              v-for="item in HEADER_NAV"
              :key="item.to"
              :to="item.to"
              class="site-header__nav-link"
              :class="{ 'site-header__nav-link--active': isActive(item.to) }"
            >
              {{ item.label }}
            </RouterLink>
          </nav>

          <div class="site-header__right">
            <div class="site-header__contacts">
              <a class="site-header__phone" :href="`tel:+${phoneTel}`">{{ phone }}</a>
              <p class="site-header__meta">{{ metaLine }}</p>
            </div>
            <a
              :href="orderSystemUrl"
              class="site-header__cta"
              target="_blank"
              rel="noopener noreferrer"
            >
              Оформить заказ
            </a>
            <button
              type="button"
              class="site-header__burger"
              aria-label="Открыть меню"
              @click="togglePanel"
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </div>
      </div>
    </div>

    <div v-show="panelOpen" class="site-header__overlay" @click="closePanel" />
    <aside class="site-header__drawer" :class="{ 'site-header__drawer--open': panelOpen }">
      <div class="site-header__drawer-head">
        <img src="/image/logo.png" alt="" class="site-header__drawer-logo" />
        <button type="button" class="site-header__drawer-close" aria-label="Закрыть" @click="closePanel">×</button>
      </div>
      <nav class="site-header__drawer-nav">
        <RouterLink
          v-for="item in HEADER_NAV"
          :key="`d-${item.to}`"
          :to="item.to"
          class="site-header__drawer-link"
          @click="closePanel"
        >
          {{ item.label }}
        </RouterLink>
        <RouterLink
          v-for="cat in categories"
          :key="cat.id"
          :to="`/${cat.alias}`"
          class="site-header__drawer-link site-header__drawer-link--muted"
          @click="closePanel"
        >
          {{ cat.pagetitle }}
        </RouterLink>
      </nav>
      <div class="site-header__drawer-foot">
        <a class="site-header__phone" :href="`tel:+${phoneTel}`">{{ phone }}</a>
        <p class="site-header__meta">{{ metaLine }}</p>
        <a
          :href="orderSystemUrl"
          class="site-header__cta site-header__cta--block"
          target="_blank"
          rel="noopener noreferrer"
        >
          Оформить заказ
        </a>
      </div>
    </aside>
  </header>
</template>
