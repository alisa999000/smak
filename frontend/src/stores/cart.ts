import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import http from '@/api/client'
import { commerceActionPayload } from '@/utils/formData'
import { tvImage } from '@/utils/dates'

export interface CartRow {
  row: string
  id: number
  name: string
  count: number
  price: number
  total: number
  options: Record<string, string>
  url: string
  image: string
}

export const useCartStore = defineStore('cart', () => {
  const count = ref(0)
  const total = ref(0)
  const hash = ref('')
  const rows = ref<CartRow[]>([])
  const wishlistRows = ref<CartRow[]>([])
  const wishlistCount = ref(0)

  const cartLabel = computed(() => {
    if (count.value <= 0) return '0 ₽'
    return `${Math.round(total.value)} ₽`
  })

  async function refresh(instance = 'products') {
    try {
      const { data } = await http.get('/api/site/commerce/cart', { params: { instance } })
      if (instance === 'wishlist') {
        wishlistRows.value = data.rows ?? []
        wishlistCount.value = data.count ?? 0
        return
      }
      count.value = Number(data.count ?? 0)
      total.value = Number(data.total ?? 0)
      hash.value = String(data.hash ?? '')
      rows.value = (data.rows ?? []).map((r: CartRow) => ({
        ...r,
        image: tvImage(r.image),
      }))
    } catch {
      /* empty cart */
    }
  }

  async function runCommerce(action: string, data: Record<string, unknown>) {
    const fd = commerceActionPayload(action, data, { carts: hash.value ? [hash.value] : [] })
    const { data: res } = await http.post('/commerce/action', fd, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    await refresh(String((data.cart as { instance?: string })?.instance ?? 'products'))
    if (data.instance === 'wishlist' || (data.cart as { instance?: string })?.instance === 'wishlist') {
      await refresh('wishlist')
    }
    return res
  }

  async function addToCart(id: number, options: Record<string, string> = {}) {
    return runCommerce('cart/add', { id, count: 1, options, cart: { instance: 'products' } })
  }

  async function addToWishlist(id: number) {
    return runCommerce('cart/add', { id, count: 1, cart: { instance: 'wishlist' } })
  }

  async function removeFromCart(row: string) {
    return runCommerce('cart/remove', { row, cart: { instance: 'products' } })
  }

  async function changeCount(row: string, newCount: number) {
    if (newCount < 1) return removeFromCart(row)
    return runCommerce('cart/recount', { row, count: newCount, cart: { instance: 'products' } })
  }

  async function removeFromWishlist(row: string) {
    return runCommerce('cart/remove', { row, cart: { instance: 'wishlist' } })
  }

  async function cleanCart() {
    return runCommerce('cart/clean', { cart: { instance: 'products' } })
  }

  return {
    count,
    total,
    hash,
    rows,
    wishlistRows,
    wishlistCount,
    cartLabel,
    refresh,
    addToCart,
    addToWishlist,
    removeFromCart,
    changeCount,
    removeFromWishlist,
    cleanCart,
  }
})
