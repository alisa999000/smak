import axios from 'axios'
import type { Banner, MenuDayItem, SiteConfig, SiteDocument } from '@/types/site'

const http = axios.create({
  withCredentials: true,
  headers: { Accept: 'application/json' },
  timeout: 30000,
})

export async function fetchConfig(): Promise<SiteConfig> {
  const { data } = await http.get<SiteConfig>('/api/site/config')
  if (data.csrfToken) {
    let meta = document.querySelector('meta[name="csrf-token"]')
    if (!meta) {
      meta = document.createElement('meta')
      meta.setAttribute('name', 'csrf-token')
      document.head.appendChild(meta)
    }
    meta.setAttribute('content', data.csrfToken)
  }
  return data
}

export async function fetchBanners(): Promise<Banner[]> {
  const { data } = await http.get<{ ok: boolean; banners: Banner[] }>('/api/site/banners')
  return data.banners
}

export async function fetchCategories(parent = 2, parentSlug?: string): Promise<SiteDocument[]> {
  const { data } = await http.get<{ ok: boolean; categories: SiteDocument[] }>('/api/site/catalog/categories', {
    params: parentSlug ? { parentSlug } : { parent },
  })
  return data.categories ?? []
}

export async function fetchProducts(parent = 2, depth = 10, parentSlug?: string): Promise<SiteDocument[]> {
  const { data } = await http.get<{ ok: boolean; products: SiteDocument[] }>('/api/site/catalog/products', {
    params: parentSlug ? { parentSlug, depth } : { parent, depth },
  })
  return data.products ?? []
}

export async function fetchProduct(alias: string): Promise<SiteDocument> {
  const { data } = await http.get<{ ok: boolean; product?: SiteDocument }>(
    `/api/site/catalog/product/${encodeURIComponent(alias)}`,
  )
  if (!data.ok || !data.product) {
    throw new Error('product_not_found')
  }
  return data.product
}

export async function fetchPage(alias: string): Promise<SiteDocument> {
  const { data } = await http.get<{ ok: boolean; page?: SiteDocument }>(`/api/site/pages/${alias}`)
  if (!data.ok || !data.page) {
    throw new Error('page_not_found')
  }
  return data.page
}

export async function fetchNews(): Promise<SiteDocument[]> {
  const { data } = await http.get<{ ok: boolean; news: SiteDocument[] }>('/api/site/news')
  return data.news
}

export async function fetchNewsItem(alias: string): Promise<SiteDocument> {
  const { data } = await http.get<{ ok: boolean; news: SiteDocument }>(`/api/site/news/${alias}`)
  return data.news
}

export async function searchProducts(q: string): Promise<SiteDocument[]> {
  const { data } = await http.get<{ ok: boolean; results: SiteDocument[] }>('/api/site/search', { params: { q } })
  return data.results
}

export async function fetchMenuDay(date: string): Promise<{ items: MenuDayItem[]; weekdayRu: string }> {
  const { data } = await http.get<{ ok: boolean; items: MenuDayItem[]; weekdayRu: string }>('/api/site/menu/day', {
    params: { date },
  })
  return { items: data.items, weekdayRu: data.weekdayRu }
}

export async function fetchMenuDayProducts(date: string, categorySlug?: string): Promise<SiteDocument[]> {
  const { data } = await http.get<{ ok: boolean; products: SiteDocument[] }>('/api/site/menu/day', {
    params: { date, format: 'products', ...(categorySlug ? { categorySlug } : {}) },
  })
  return data.products ?? []
}

export async function commerceAction(payload: Record<string, unknown>): Promise<unknown> {
  const { data } = await http.post('/commerce/action', payload)
  return data
}

export async function fetchAccountMe() {
  const { data } = await http.get('/api/site/account/me')
  return data
}

export async function fetchOrders() {
  const { data } = await http.get('/api/site/account/orders')
  return data.orders ?? []
}

export async function repeatOrder(id: number) {
  const { data } = await http.post(`/api/site/account/orders/${id}/repeat`)
  return data
}

export async function fetchCheckout() {
  const { data } = await http.get('/api/site/commerce/checkout')
  return data
}

export async function submitOrder(fields: Record<string, unknown>) {
  const { data } = await http.post('/api/site/commerce/order', fields)
  return data
}

export async function sendFeedback(payload: Record<string, string>) {
  const { data } = await http.post('/api/site/account/feedback', payload)
  return data
}

export default http
