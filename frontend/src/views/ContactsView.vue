<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import PageLayout from '@/components/layout/PageLayout.vue'
import { fetchPage } from '@/api/client'
import CompanyRequisites from '@/components/layout/CompanyRequisites.vue'
import { useSiteStore } from '@/stores/site'
import {
  DEFAULT_EMAIL,
  DEFAULT_HOURS,
  DEFAULT_ORDER_DEADLINE,
  DEFAULT_PHONE,
} from '@/data/siteDefaults'
import type { SiteDocument } from '@/types/site'

const site = useSiteStore()
const page = ref<SiteDocument | null>(null)
const mapHost = ref<HTMLElement | null>(null)

const phone = computed(() => site.config?.phone ?? DEFAULT_PHONE)
const email = computed(() => site.config?.email ?? DEFAULT_EMAIL)
const hours = computed(() => site.config?.hours ?? DEFAULT_HOURS)
const address = computed(
  () => site.config?.company?.addressActual ?? 'ул. Планерная, дом 59А, ТК ЛеоМолл, пом. 461, 4 этаж',
)

const contactItems = computed(() => [
  {
    icon: '/assets/images/maps.svg',
    label: 'Адрес',
    value: address.value,
    href: '',
  },
  {
    icon: '/assets/images/time.svg',
    label: 'Режим работы',
    value: `${hours.value}. ${DEFAULT_ORDER_DEADLINE}.`,
    href: '',
  },
  {
    icon: '/assets/images/phn.svg',
    label: 'Телефон',
    value: phone.value,
    href: `tel:${phone.value.replace(/\D/g, '')}`,
  },
  {
    icon: '/assets/images/em.svg',
    label: 'Email',
    value: email.value,
    href: `mailto:${email.value}`,
  },
])

onMounted(async () => {
  await site.loadConfig()
  try {
    page.value = await fetchPage('kontakty')
  } catch {
    page.value = null
  }

  if (mapHost.value && !mapHost.value.querySelector('script')) {
    const script = document.createElement('script')
    script.type = 'text/javascript'
    script.charset = 'utf-8'
    script.async = true
    script.src =
      'https://api-maps.yandex.ru/services/constructor/1.0/js/?um=constructor%3Ab61441f8fbebc90d47953cdbd0aabc282fda5429fbe645ab4568f099599fc241&width=100%25&height=400&lang=ru_RU&scroll=true'
    mapHost.value.appendChild(script)
  }
})
</script>

<template>
  <PageLayout :title="page?.pagetitle ?? 'Контакты'">
    <div class="contacts-grid">
      <div class="site-card contacts-map">
        <div ref="mapHost" class="contacts-map__host" />
      </div>
      <div class="site-card contacts-info">
        <ul class="info-list">
          <li v-for="item in contactItems" :key="item.label" class="info-list__item">
            <span class="info-list__icon" aria-hidden="true">
              <img :src="item.icon" alt="" />
            </span>
            <div class="info-list__body">
              <span class="info-list__label">{{ item.label }}</span>
              <a v-if="item.href" class="info-list__value info-list__link" :href="item.href">{{ item.value }}</a>
              <span v-else class="info-list__value">{{ item.value }}</span>
            </div>
          </li>
        </ul>
      </div>
    </div>

    <CompanyRequisites class="contacts-requisites-block" />

    <div v-if="page?.content" class="site-card site-card--prose contacts-page__cms" v-html="page.content" />
  </PageLayout>
</template>

<style scoped>
.contacts-page__cms :deep(a) {
  color: var(--site-green);
  text-decoration: underline;
  text-decoration-color: rgba(81, 123, 57, 0.35);
}

.contacts-page__cms :deep(a:hover) {
  color: var(--site-green-dark);
}
</style>
