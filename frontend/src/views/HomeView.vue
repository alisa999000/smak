<script setup lang="ts">
import { onMounted, ref } from 'vue'
import WhoWeAre from '@/components/home/WhoWeAre.vue'
import HomeHero from '@/components/home/HomeHero.vue'
import HomeComplexBlock from '@/components/home/HomeComplexBlock.vue'
import HomeLeadBlock from '@/components/home/HomeLeadBlock.vue'
import HomePromoCarousel from '@/components/home/HomePromoCarousel.vue'
import MenuDownloadButton from '@/components/menu/MenuDownloadButton.vue'
import FaqAccordion from '@/components/faq/FaqAccordion.vue'
import { homeFaq, homeMission } from '@/data/homeContent'
import { fetchMenuDay } from '@/api/client'
import { formatDateAjax, formatDateShort, formatWeight, parsePriceNumber, weekDates } from '@/utils/dates'
import type { MenuDayItem } from '@/types/site'

const dates = weekDates()
const selectedIndex = ref(2)
const loading = ref(false)
const menuOpen = ref(true)
const menuItems = ref<MenuDayItem[]>([])

async function loadDay(index: number) {
  selectedIndex.value = index
  loading.value = true
  menuOpen.value = true
  try {
    const res = await fetchMenuDay(formatDateAjax(dates[index]))
    menuItems.value = res.items
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  await loadDay(2)
})
</script>

<template>
  <div class="home-page">
    <div class="container">
      <HomeHero />
    </div>

    <!-- 3.1: комплексный обед → миссия → меню -->
    <div class="container">
      <HomeComplexBlock />
    </div>

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

    <div class="container">
      <section class="home-menu">
        <button
          type="button"
          class="home-menu__toggle"
          :aria-expanded="menuOpen"
          @click="menuOpen = !menuOpen"
        >
          <span class="home-menu__toggle-title">Меню на неделю</span>
          <span class="home-menu__toggle-meta">
            {{ menuOpen ? 'Скрыть' : 'Показать' }}
            <span class="home-menu__chevron" :class="{ 'is-open': menuOpen }" aria-hidden="true" />
          </span>
        </button>

        <div v-show="menuOpen" class="home-menu__body">
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

          <div class="produkt_day produkt_day--compact">
            <div
              v-for="(item, i) in menuItems"
              :key="i"
              class="produkt_day__col produkt_day__col--dense"
            >
              <div class="item_produkt product-card product-card--home product-card--text">
                <div class="product-card__body">
                  <div class="item_produkt_title product-card__title">{{ item.name }}</div>
                  <div v-if="item.description" class="item_produkt_desc product-card__desc">
                    {{ item.description }}
                  </div>
                  <div class="item_produkt_buy product-card__footer">
                    <div class="item_produkt_price_block">
                      <div class="item_produkt_price product-card__price">
                        <template v-if="parsePriceNumber(item.price) !== null">
                          <span class="product-card__amount">
                            {{ parsePriceNumber(item.price)!.toLocaleString('ru-RU') }}
                          </span>
                          <span class="product-card__currency">₽</span>
                        </template>
                        <span v-if="formatWeight(item.weight)" class="product-card__weight">
                          {{ formatWeight(item.weight) }}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div v-if="!loading && !menuItems.length" class="produkt_day__empty">
              <p>Товаров на выбранный день нет</p>
            </div>
          </div>
        </div>
      </section>
    </div>

    <div class="container">
      <WhoWeAre />
    </div>

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

<style scoped>
.home-menu {
  margin: 0 0 48px;
}

.home-menu__toggle {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 18px 4px 16px;
  border: 0;
  border-bottom: 1px solid rgba(44, 39, 36, 0.12);
  background: transparent;
  cursor: pointer;
  text-align: left;
}

.home-menu__toggle-title {
  font-size: clamp(22px, 3vw, 28px);
  font-weight: 600;
  color: #2c2724;
}

.home-menu__toggle-meta {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 600;
  color: #517b39;
  white-space: nowrap;
}

.home-menu__chevron {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-right: 2px solid currentColor;
  border-bottom: 2px solid currentColor;
  transform: rotate(45deg);
  transition: transform 0.2s ease;
}

.home-menu__chevron.is-open {
  transform: rotate(-135deg);
  margin-top: 4px;
}

.home-menu__body {
  padding-top: 18px;
}

.produkt_day--compact {
  gap: 12px;
  align-items: stretch;
}

.produkt_day__col--dense {
  flex: 0 0 calc(50% - 6px);
  max-width: calc(50% - 6px);
  display: flex;
}

.product-card--text {
  padding: 14px 16px !important;
  min-height: 0 !important;
  gap: 0 !important;
}

.product-card--text :deep(.product-image),
.product-card--text :deep(.item_produkt-img),
.product-card--text .item_produkt-img {
  display: none !important;
  height: 0 !important;
  margin: 0 !important;
}

.product-card--text .product-card__body {
  gap: 8px;
}

.product-card--text .product-card__title {
  font-size: 14px;
  font-weight: 600;
  line-height: 1.3;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.product-card--text .product-card__desc {
  font-size: 12px;
  line-height: 1.4;
  margin: 0;
  color: #6b6560;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.product-card--text .product-card__footer {
  margin-top: auto;
  padding-top: 6px;
}

.product-card--text .product-card__price {
  gap: 4px 8px;
}

.product-card--text .product-card__amount {
  font-size: 16px;
}

.product-card--text .product-card__weight {
  flex: 0 0 auto;
  font-size: 12px;
}

@media (min-width: 768px) {
  .produkt_day__col--dense {
    flex: 0 0 calc(33.333% - 8px);
    max-width: calc(33.333% - 8px);
  }
}

@media (min-width: 992px) {
  .produkt_day__col--dense {
    flex: 0 0 calc(20% - 10px);
    max-width: calc(20% - 10px);
  }
}

@media (min-width: 1200px) {
  .produkt_day__col--dense {
    flex: 0 0 calc(16.666% - 10px);
    max-width: calc(16.666% - 10px);
  }
}
</style>
