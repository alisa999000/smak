import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
})

export async function login(password: string) {
  const { data } = await api.post('/auth/login', { password })
  return data
}

export async function fetchProducts() {
  const { data } = await api.get('/admin/products')
  return data.products ?? data
}

export async function fetchCategories() {
  const { data } = await api.get('/admin/categories')
  return data.categories ?? data
}

export async function fetchPages() {
  const { data } = await api.get('/admin/pages')
  return data.pages ?? data
}

export async function importIiko() {
  const { data } = await api.post('/admin/import/iiko')
  return data
}

export default api
