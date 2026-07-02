<script setup lang="ts">
import { onMounted, ref } from 'vue'
import WhoWeAre from '@/components/home/WhoWeAre.vue'
import HomeHero from '@/components/home/HomeHero.vue'
import HomeComplexBlock from '@/components/home/HomeComplexBlock.vue'
import HomeLeadBlock from '@/components/home/HomeLeadBlock.vue'
import HomePromoCarousel from '@/components/home/HomePromoCarousel.vue'
import ProductImage from '@/components/catalog/ProductImage.vue'
import MenuDownloadButton from '@/components/menu/MenuDownloadButton.vue'
import FaqAccordion from '@/components/faq/FaqAccordion.vue'
import { homeFaq, homeMission } from '@/data/homeContent'
import { fetchBanners, fetchMenuDay } from '@/api/client'
import { formatDateAjax, formatDateShort, formatWeight, parsePriceNumber, weekDates } from '@/utils/dates'
import type { Banner, MenuDayItem } from '@/types/site'

const dates = weekDates()
const selectedIndex = ref(2)
const loading = ref(false)
const menuItems = ref<MenuDayItem[]>([])
const banners = ref<Banner[]>([])

async function loadDay(index: number) {
  selectedIndex.value = index
  loading.value = true
  try {
    const res = await fetchMenuDay(formatDateAjax(dates[index]))
    menuItems.value = res.items
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  try {
    banners.value = await fetchBanners()
  } catch {
    banners.value = []
  }
  await loadDay(2)
})
</script>

<template>
  <div class="home-page">
    <div class="container">
      <HomeHero :banners="banners" />
    </div>

    <div class="container">
      <div class="data_day">
        <div id="dates">
          <div
            v-for="(date, i) in dates"
            :key="i"
            class="date"
            :class="{ selected: i === selectedIndex }"
            @click="loadDay(i)"
          >
            {{ formatDateShort(date) }}<template v-if="i === 2"> (завтра)</template>
          </div>
        </div>
        <MenuDownloadButton />
      </div>
      <div v-if="loading" class="loader-overlay"><div class="loader-spinner" /></div>
      <div class="produkt_day">
        <div v-for="(item, i) in menuItems" :key="i" class="col-md-3 col-sm-6 produkt_day__col">
          <div class="item_produkt product-card product-card--home">
            <div class="item_produkt-img product-card__media">
              <ProductImage :src="item.image" :alt="item.name" />
            </div>
            <div class="product-card__body">
              <div class="item_produkt_title product-card__title">{{ item.name }}</div>
              <div v-if="item.description" class="item_produkt_desc product-card__desc">{{ item.description }}</div>
              <div class="item_produkt_buy product-card__footer">
                <div class="item_produkt_price_block">
                  <div class="item_produkt_price product-card__price">
                    <template v-if="parsePriceNumber(item.price) !== null">
                      <span class="product-card__amount">{{ parsePriceNumber(item.price)!.toLocaleString('ru-RU') }}</span>
                      <span class="product-card__currency">₽</span>
                    </template>
                    <span v-if="formatWeight(item.weight)" class="product-card__weight">{{ formatWeight(item.weight) }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-if="!loading && !menuItems.length" class="produkt_day__empty"><p>Товаров на выбранный день нет</p></div>
      </div>
    </div>

    <!-- П.10: миссия + три промо-слайда -->
    <div class="container">
      <div class="promo_block row">
        <div class="col-md-8">
          <div class="promo_text">
            <div class="promo_text_title">{{ homeMission.title }}</div>
            <div class="promo_text_desc">{{ homeMission.lead }}</div>
          </div>
        </div>
        <div class="col-md-4">
          <HomePromoCarousel />
        </div>
      </div>
    </div>

    <!-- П.11–12: комплексный обед -->
    <div class="container">
      <HomeComplexBlock />
    </div>

    <div class="container">
      <WhoWeAre />
    </div>

    <!-- П.13: SEO + форма заявки -->
    <div class="container">
      <HomeLeadBlock />
    </div>

    <div class="container">
      <div class="faq_block home-faq">
        <div class="faq_blcok_title">Часто задаваемые вопросы</div>
        <FaqAccordion :items="[...homeFaq]" />
        <RouterLink to="/chasto-zadavaemy-voprosy" class="home-faq-more">Все вопросы →</RouterLink>
      </div>
    </div>

    <div class="container">
      <div class="info-block">
        <div class="image-container">
          <img src="/image/kafe.jpg" alt="Кафе" />
        </div>
        <div class="text-container">
          <img src="/image/happyday.png" alt="" />
          <div class="text-container-info">
            <p>Ул. Планерная 59А, ТК Leomoll</p>
            <p>Ежедневно с 21:00 до 22:00 горячая распродажа <span>Скидка -50%</span> На все меню</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
