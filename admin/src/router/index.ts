import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory('/admin/'),
  routes: [
    { path: '/login', name: 'login', component: () => import('@/views/LoginView.vue'), meta: { layout: 'auth' } },
    { path: '/', redirect: '/dashboard' },
    { path: '/dashboard', name: 'dashboard', component: () => import('@/views/DashboardView.vue') },
    { path: '/categories', name: 'categories', component: () => import('@/views/CategoriesView.vue') },
    { path: '/products', name: 'products', component: () => import('@/views/ProductsView.vue') },
    { path: '/products/new', name: 'product-new', component: () => import('@/views/ProductEditView.vue') },
    { path: '/products/:id', name: 'product-edit', component: () => import('@/views/ProductEditView.vue') },
    { path: '/weekly', name: 'weekly', component: () => import('@/views/WeeklyView.vue') },
    { path: '/pages', name: 'pages', component: () => import('@/views/PagesView.vue') },
    { path: '/pages/new', name: 'page-new', component: () => import('@/views/PageEditView.vue') },
    { path: '/pages/:id', name: 'page-edit', component: () => import('@/views/PageEditView.vue') },
    { path: '/import/menu', name: 'import-menu', component: () => import('@/views/ImportMenuView.vue') },
    { path: '/import/iiko', name: 'import-iiko', component: () => import('@/views/ImportIikoView.vue') },
    { path: '/export', name: 'export', component: () => import('@/views/ExportView.vue') },
  ],
})

router.beforeEach(async (to) => {
  if (to.name === 'login') return true
  try {
    const res = await fetch('/api/auth/check', { credentials: 'include' })
    if (!res.ok) return { name: 'login' }
  } catch {
    return { name: 'login' }
  }
  return true
})

export default router
