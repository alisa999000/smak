<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import PageLayout from '@/components/layout/PageLayout.vue'
import { fetchCheckout, submitOrder } from '@/api/client'
import { formatPrice } from '@/utils/dates'

const router = useRouter()
const loading = ref(true)
const error = ref('')
const cart = ref<{ rows: Array<Record<string, unknown>>; count: number; total: number }>({ rows: [], count: 0, total: 0 })
const deliveries = ref<Array<{ code: string; title: string }>>([])
const payments = ref<Array<{ code: string; title: string }>>([])

const form = ref({
  name: '',
  phone: '',
  street: '',
  apartment: '',
  floor: '',
  entrance: '',
  doorCode: '',
  deliveryTime: '',
  comment: '',
  delivery_method: '',
  payment_method: '',
})

onMounted(async () => {
  try {
    const data = await fetchCheckout()
    cart.value = data.cart
    deliveries.value = data.deliveries ?? []
    payments.value = data.payments ?? []
    if (deliveries.value[0]) form.value.delivery_method = deliveries.value[0].code
    if (payments.value[0]) form.value.payment_method = payments.value[0].code
  } finally {
    loading.value = false
  }
})

async function submit() {
  error.value = ''
  try {
    await submitOrder({
      name: form.value.name,
      phone: form.value.phone,
      street: form.value.street,
      city: form.value.apartment,
      delivery_method: form.value.delivery_method,
      payment_method: form.value.payment_method,
      comment: form.value.comment,
    })
    router.push({ path: '/oformlenie-zakaza', query: { success: '1' } })
  } catch {
    error.value = 'Не удалось оформить заказ'
  }
}
</script>

<template>
  <div id="ajax-a" class="body-order header-absolute">
    <div class="ajax-b">
      <PageLayout title="Оформление заказа">
            <div v-if="$route.query.success" class="succes-order" style="width:auto;padding:0 50px;margin-top:40px">
              <div class="title" style="font-size:30px;font-weight:700;margin-bottom:25px">Спасибо!</div>
              <p style="margin-bottom:30px">Ваша заявка оформлена. Мы скоро свяжемся с вами для уточнения деталей.</p>
            </div>
            <div v-else-if="loading">Загрузка…</div>
            <div v-else class="order">
              <form class="order-form" @submit.prevent="submit">
                <div class="order-left">
                  <div class="order-container">
                    <div class="order-form-block">
                      <div class="order-form-block-title">Личные данные</div>
                      <div class="input_block">
                        <div class="item_input_block">
                          <div class="order-form-caption">Имя</div>
                          <input v-model="form.name" class="form-control order-form-input" placeholder="Ваше имя" required />
                        </div>
                        <div class="item_input_block">
                          <div class="order-form-caption">Телефон*</div>
                          <input v-model="form.phone" id="phone_zakaz" class="form-control order-form-input" placeholder="+7 (___) __-__-___" required />
                        </div>
                      </div>
                    </div>
                    <div class="order-form-block">
                      <div class="order-form-block-title">Адрес доставки</div>
                      <div class="input_block">
                        <div class="item_input_block">
                          <div class="order-form-caption">Улица</div>
                          <input v-model="form.street" class="form-control order-form-input" placeholder="Улица" />
                        </div>
                        <div class="item_input_block_two">
                          <div class="order-form-caption">Квартира, Этаж</div>
                          <div class="form-group-two">
                            <input v-model="form.apartment" class="form-control order-form-input" placeholder="Квартира" />
                            <input v-model="form.floor" class="form-control order-form-input" placeholder="Этаж" />
                          </div>
                        </div>
                        <div class="item_input_block_two">
                          <div class="order-form-caption">Подъезд, Код двери</div>
                          <div class="form-group-two">
                            <input v-model="form.entrance" class="form-control order-form-input" placeholder="Подъезд" />
                            <input v-model="form.doorCode" class="form-control order-form-input" placeholder="Код двери" />
                          </div>
                        </div>
                        <div class="item_input_block">
                          <div class="order-form-caption">Время доставки</div>
                          <input v-model="form.deliveryTime" class="form-control order-form-input" placeholder="Время доставки" />
                        </div>
                        <div class="item_input_block">
                          <div class="order-form-caption">Комментарий</div>
                          <textarea v-model="form.comment" class="form-control order-form-input" placeholder="Например, кто будет принимать заказ" />
                        </div>
                      </div>
                    </div>
                    <div class="order-form-block">
                      <div class="order-form-block-title">Способ оплаты</div>
                      <div class="input_block">
                        <div data-commerce-payments class="payment_block">
                          <label v-for="p in payments" :key="p.code" class="d-block mb-2">
                            <input v-model="form.payment_method" type="radio" :value="p.code" /> {{ p.title }}
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="order-right">
                  <div class="cart_block_info">
                    <div class="title">Ваш заказ</div>
                    <div v-for="row in cart.rows" :key="String(row.row)" class="mb-2">
                      {{ row.name }} × {{ row.count }}
                    </div>
                    <div class="all_itog">
                      <div class="all_itog_title">Общий итог:</div>
                      <div class="all_itog_price">{{ formatPrice(Number(cart.total)) }}</div>
                    </div>
                    <div v-if="error" class="alert alert-danger">{{ error }}</div>
                    <button type="submit" class="btn btn-green mt-3">Подтвердить заказ</button>
                  </div>
                </div>
              </form>
            </div>
      </PageLayout>
    </div>
  </div>
</template>
