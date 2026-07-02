<script setup lang="ts">
import { onMounted } from 'vue'
import PageLayout from '@/components/layout/PageLayout.vue'
import { useCartStore } from '@/stores/cart'

const cart = useCartStore()

onMounted(async () => {
  await cart.refresh('wishlist')
})
</script>

<template>
  <PageLayout title="Избранное">
    <p v-if="!cart.wishlistCount">Список избранного пуст</p>
    <div v-else class="row produkt_day">
      <div v-for="row in cart.wishlistRows" :key="row.row" class="col-md-3">
        <div class="item_produkt">
          <div class="item_produkt-img">
            <RouterLink :to="row.url.replace(/\.html$/, '') || '/'" class="main_item_lg_link" />
            <img :src="row.image" :alt="row.name" />
            <div id="addwishlist">
              <a href="#" @click.prevent="cart.removeFromWishlist(row.row)">
                <i><svg width="26" height="26" viewBox="0 0 20 18" fill="#517B39" xmlns="http://www.w3.org/2000/svg"><path d="M2.52539 2.58632C4.2732 0.852541 7.10163 0.825093 8.88338 2.52317L9.96305 3.78453L10.879 2.70237C11.8993 1.67251 13.054 1.19796 14.2595 1.20001C16.1029 1.19875 17.7559 2.29786 18.4558 3.97349C19.1265 5.57919 18.7991 7.41875 17.6282 8.69931L9.96321 16.3096L2.46259 8.86696C0.755507 7.10532 0.782416 4.31532 2.52539 2.58632Z" stroke="#517B39" stroke-width="1"/></svg></i>
              </a>
            </div>
          </div>
          <div class="item_produkt_title">{{ row.name }}</div>
          <div class="item_produkt_buy">
            <div class="item_produkt_price_block">
              <div class="item_produkt_price">{{ row.price }} ₽</div>
            </div>
            <div class="item_produkt_adcart">
              <button type="button" class="cardsklad btn btn-white-f add-to-cart-btn" @click="cart.addToCart(row.id)">+</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </PageLayout>
</template>
