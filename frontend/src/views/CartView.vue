<script setup lang="ts">
import { onMounted } from 'vue'
import PageLayout from '@/components/layout/PageLayout.vue'
import { useCartStore } from '@/stores/cart'
import { RouterLink } from 'vue-router'
import { formatPrice, tvImage } from '@/utils/dates'

const cart = useCartStore()

onMounted(async () => {
  await cart.refresh('products')
})

async function dec(row: string, count: number) {
  await cart.changeCount(row, count - 1)
}
async function inc(row: string, count: number) {
  await cart.changeCount(row, count + 1)
}
</script>

<template>
  <div id="ajax-a">
    <div class="ajax-b body-cart header-absolute">
      <PageLayout title="Корзина">
        <div v-if="!cart.count" class="py-4">Корзина пуста. <RouterLink to="/">Перейти в меню</RouterLink></div>
        <div v-else class="cart" :data-commerce-cart="cart.hash">
          <div class="cart-left">
            <div
              v-for="row in cart.rows"
              :key="row.row"
              :data-id="row.id"
              :data-commerce-row="row.row"
              class="item_card"
            >
              <div class="td-image">
                <RouterLink :to="row.url.replace(/\.html$/, '') || '/'" class="image">
                  <img :src="tvImage(row.image)" class="img-fluid" :alt="row.name" />
                </RouterLink>
              </div>
              <div class="td-info">
                <div class="item">
                  <div class="title"><RouterLink :to="row.url.replace(/\.html$/, '') || '/'">{{ row.name }}</RouterLink></div>
                  <ul class="params">
                    <li v-if="row.options.material"><div class="params-label">Доставка на {{ row.options.material }}</div></li>
                  </ul>
                </div>
              </div>
              <div class="td-price sab">
                <div class="action"><div class="price">{{ formatPrice(row.price) }}</div></div>
              </div>
              <div class="td-counter">
                <div class="counter">
                  <input type="text" class="counter-input" :value="row.count" readonly />
                  <div class="counter-btn counter-btn-prev" @click="dec(row.row, row.count)">&minus;</div>
                  <div class="counter-btn counter-btn-next" @click="inc(row.row, row.count)">&plus;</div>
                </div>
              </div>
              <div class="td-price">
                <div class="action"><div class="price">{{ formatPrice(row.total) }}</div></div>
              </div>
              <div class="td-delite">
                <a href="#" class="remove" @click.prevent="cart.removeFromCart(row.row)">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="20" fill="none"><path fill="#D03B1D" fill-rule="evenodd" d="M15.978 6.72a.746.746 0 0 1 .671.808c-.006.068-.534 6.779-.839 9.594-.189 1.747-1.314 2.81-3.013 2.842a182.852 182.852 0 0 1-7.664-.006c-1.63-.033-2.759-1.117-2.943-2.83-.307-2.84-.833-9.533-.838-9.6a.744.744 0 0 1 .67-.808.757.757 0 0 1 .788.687Z" clip-rule="evenodd"/></svg>
                </a>
              </div>
            </div>
          </div>
          <div class="cart-right">
            <div class="cart_block_info">
              <div class="title">Ваш заказ</div>
              <div class="itog">
                <div class="count_tovar">{{ cart.count }} товара</div>
                <div class="total_tovar">{{ formatPrice(cart.total) }}</div>
              </div>
              <div class="all_itog">
                <div class="all_itog_title">Общий итог:</div>
                <div class="all_itog_price">{{ formatPrice(cart.total) }}</div>
              </div>
              <div class="cart-form">
                <div class="action">
                  <RouterLink to="/oformlenie-zakaza" class="btn btn-green no-barba">Оформить заказ {{ formatPrice(cart.total) }}</RouterLink>
                </div>
              </div>
              <div class="mt-3">
                <button type="button" class="btn btn-link" @click="cart.cleanCart()">Очистить корзину</button>
              </div>
            </div>
          </div>
        </div>
      </PageLayout>
    </div>
  </div>
</template>
