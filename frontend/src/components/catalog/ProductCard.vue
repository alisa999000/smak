<script setup lang="ts">
import { computed } from 'vue'
import type { SiteDocument } from '@/types/site'
import { formatWeight, parsePriceNumber } from '@/utils/dates'
import { docRoute } from '@/utils/catalog'
import ProductImage from '@/components/catalog/ProductImage.vue'

const props = withDefaults(
  defineProps<{ product: SiteDocument; parentTitle?: string; hideImage?: boolean; dense?: boolean }>(),
  { hideImage: false, dense: false },
)

const priceAmount = computed(() => parsePriceNumber(props.product.tvs.price))
const weightLabel = computed(() => formatWeight(props.product.tvs.massa))
</script>

<template>
  <div
    class="produkt_day__col"
    :class="dense ? 'produkt_day__col--dense col-md-2 col-sm-4' : 'col-md-3 col-sm-6'"
  >
    <article class="product-card item_produkt" :class="{ 'product-card--text': hideImage }">
      <RouterLink
        v-if="!hideImage"
        :to="docRoute(product.url)"
        class="product-card__media item_produkt-img"
      >
        <ProductImage :src="product.tvs.image" :alt="product.pagetitle" />
      </RouterLink>

      <div class="product-card__body">
        <h3 class="product-card__title item_produkt_title">
          <RouterLink :to="docRoute(product.url)">{{ product.pagetitle }}</RouterLink>
        </h3>

        <p v-if="product.tvs.sostav" class="product-card__desc item_produkt_desc">{{ product.tvs.sostav }}</p>

        <div class="product-card__footer item_produkt_buy">
          <div class="item_produkt_price_block">
            <div class="item_produkt_price product-card__price">
              <template v-if="priceAmount !== null">
                <span class="product-card__amount">{{ priceAmount.toLocaleString('ru-RU') }}</span>
                <span class="product-card__currency">₽</span>
              </template>
              <span v-else class="product-card__no-price">—</span>
              <span v-if="weightLabel" class="product-card__weight">{{ weightLabel }}</span>
            </div>
            <div v-if="parentTitle" class="item_produkt_teg"><span>{{ parentTitle }}</span></div>
          </div>
        </div>
      </div>
    </article>
  </div>
</template>

<style scoped>
.product-card {
  height: 100%;
  margin: 0;
  padding: 12px;
  gap: 0;
  box-sizing: border-box;
  transition: box-shadow 0.2s ease, transform 0.2s ease;
}

.product-card:hover {
  box-shadow: 0 10px 28px rgba(44, 39, 36, 0.08);
  transform: translateY(-2px);
}

.product-card__media {
  display: block;
  text-decoration: none;
  margin-bottom: 12px;
}

.product-card__body {
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
  padding: 0 2px;
}

.product-card__title {
  margin: 0;
  line-height: 1.35;
}

.product-card__title a {
  color: inherit;
  text-decoration: none;
}

.product-card__title a:hover {
  color: #517b39;
}

.product-card__desc {
  margin: 0;
  font-size: 13px;
  line-height: 1.45;
  color: #6b6560;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.product-card__footer {
  margin-top: auto;
  padding-top: 6px;
}

.product-card__price {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 4px 6px;
}

.product-card__amount {
  font-size: 18px;
  font-weight: 700;
  line-height: 1.1;
  color: #413836;
}

.product-card__currency {
  font-size: 16px;
  font-weight: 700;
  line-height: 1.1;
  color: #413836;
}

.product-card__no-price {
  font-size: 16px;
  color: #8a8279;
}

.product-card__weight {
  flex: 1 0 100%;
  font-size: 12px;
  font-weight: 500;
  line-height: 1.2;
  color: #8a8279;
}
</style>
