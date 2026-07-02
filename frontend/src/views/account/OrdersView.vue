<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { fetchOrders, repeatOrder } from '@/api/client'
import { useAuthStore } from '@/stores/auth'

interface OrderRow {
  id: number
  createdAt: string
  amount: number
  currency: string
  status: string
}

const auth = useAuthStore()
const router = useRouter()
const orders = ref<OrderRow[]>([])
const loading = ref(true)

onMounted(async () => {
  await auth.loadMe()
  if (!auth.isAuthenticated) {
    router.push('/account/avtorizaciya')
    return
  }
  try {
    orders.value = await fetchOrders()
  } finally {
    loading.value = false
  }
})

async function repeat(id: number) {
  await repeatOrder(id)
  router.push('/korzina')
}
</script>

<template>
  <div>
    <h1 class="tit-main">История заказов</h1>
    <div v-if="!auth.isAuthenticated" class="commerce-order-history">
      <p class="text-muted">
        Чтобы увидеть свои заказы, <RouterLink to="/account/avtorizaciya">войдите</RouterLink>
        или <RouterLink to="/account/registraciya">зарегистрируйтесь</RouterLink>.
      </p>
    </div>
    <div v-else-if="loading">Загрузка…</div>
    <div v-else-if="!orders.length" class="py-3">Заказов пока нет</div>
    <div v-else class="table-responsive commerce-order-history">
      <table class="table table-bordered table-striped">
        <thead>
          <tr><th>№</th><th>Дата</th><th>Сумма</th><th>Статус</th><th>Действия</th></tr>
        </thead>
        <tbody>
          <tr v-for="o in orders" :key="o.id">
            <td>{{ o.id }}</td>
            <td>{{ o.createdAt }}</td>
            <td><strong>{{ o.amount }} {{ o.currency }}</strong></td>
            <td>{{ o.status }}</td>
            <td>
              <button type="button" class="btn btn-sm btn-outline-primary" @click="repeat(o.id)">
                Повторить в корзине
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
