import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(),
  scrollBehavior: () => ({ top: 0 }),
  routes: [
    { path: '/', name: 'home', component: () => import('@/views/HomeView.vue') },
    { path: '/korzina', name: 'cart', component: () => import('@/views/CartView.vue') },
    { path: '/oformlenie-zakaza', name: 'checkout', component: () => import('@/views/CheckoutView.vue') },
    { path: '/izbrannoe', name: 'wishlist', component: () => import('@/views/WishlistView.vue') },
    { path: '/rezultaty-poiska', name: 'search', component: () => import('@/views/SearchView.vue') },
    { path: '/akcii', name: 'promotions', component: () => import('@/views/PromotionsView.vue') },
    { path: '/chasto-zadavaemy-voprosy', name: 'faq', component: () => import('@/views/FaqView.vue') },
    { path: '/kontakty', name: 'contacts', component: () => import('@/views/ContactsView.vue') },
    { path: '/polzovatelskoe-soglashenie', name: 'legal-user', component: () => import('@/views/LegalView.vue') },
    { path: '/politika-personalnyh-dannyh', name: 'legal-privacy', component: () => import('@/views/LegalView.vue') },
    { path: '/pravila-okazaniya-uslug', name: 'legal-terms', component: () => import('@/views/LegalView.vue') },
    { path: '/litsenzionnoe-soglashenie', name: 'legal-license', component: () => import('@/views/LegalView.vue') },
    { path: '/novosti', name: 'news', component: () => import('@/views/NewsView.vue') },
    { path: '/novosti/:alias', name: 'news-detail', component: () => import('@/views/NewsDetailView.vue') },
    { path: '/company', name: 'company', component: () => import('@/views/CompanyView.vue') },
    {
      path: '/account-b2b',
      component: () => import('@/views/account/AccountLayout.vue'),
      children: [
        { path: '', redirect: () => (useAuthStore().isAuthenticated ? '/account-b2b/profil' : '/account-b2b/avtorizaciya') },
        { path: 'profil', name: 'b2b-profile', component: () => import('@/views/account-b2b/ProfileView.vue') },
        { path: 'avtorizaciya', name: 'b2b-login', component: () => import('@/views/account-b2b/LoginView.vue') },
        { path: 'istoriya-zakazov', name: 'b2b-orders', component: () => import('@/views/account-b2b/OrdersView.vue') },
      ],
    },
    {
      path: '/account',
      component: () => import('@/views/account/AccountLayout.vue'),
      children: [
        { path: '', redirect: () => (useAuthStore().isAuthenticated ? '/account/profil' : '/account/avtorizaciya') },
        { path: 'registraciya', name: 'register', component: () => import('@/views/account/RegisterView.vue') },
        { path: 'avtorizaciya', name: 'login', component: () => import('@/views/account/LoginView.vue') },
        { path: 'profil', name: 'profile', component: () => import('@/views/account/ProfileView.vue') },
        { path: 'istoriya-zakazov', name: 'orders', component: () => import('@/views/account/OrdersView.vue') },
      ],
    },
    { path: '/menyu/:section/:product', name: 'menu-product', component: () => import('@/views/ProductView.vue'), props: (route) => ({ alias: String(route.params.product) }) },
    { path: '/menyu/:section?', name: 'catalog', component: () => import('@/views/CatalogView.vue') },
    { path: '/:alias', name: 'dynamic', component: () => import('@/views/DynamicView.vue') },
  ],
})

const protectedRoutes = new Set(['profile', 'orders', 'b2b-profile', 'b2b-orders'])

router.beforeEach(async (to) => {
  const auth = useAuthStore()
  if (!auth.loaded) {
    await auth.loadMe()
  }

  const name = String(to.name ?? '')
  if (protectedRoutes.has(name) && !auth.isAuthenticated) {
    return name.startsWith('b2b') ? '/account-b2b/avtorizaciya' : '/account/avtorizaciya'
  }

  if (auth.isAuthenticated && (name === 'login' || name === 'register' || name === 'b2b-login')) {
    return name === 'b2b-login' ? '/account-b2b/profil' : '/account/profil'
  }
})

export default router
