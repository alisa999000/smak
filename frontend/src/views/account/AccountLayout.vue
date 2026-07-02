<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const route = useRoute()

onMounted(() => auth.loadMe())

const isLegal = computed(() => route.path.startsWith('/account-b2b'))
const isGuestPage = computed(() =>
  ['login', 'register', 'b2b-login'].includes(String(route.name ?? '')),
)
const showSidebar = computed(() => auth.isAuthenticated)

const breadcrumbTitle = computed(() => {
  if (isLegal.value) return 'Личный кабинет для юр. лиц'
  if (!showSidebar.value && route.name === 'register') return 'Регистрация'
  if (!showSidebar.value && isGuestPage.value) return 'Авторизация'
  return 'Личный кабинет'
})
</script>

<template>
  <div class="container cabinet-page" :class="{ 'cabinet-page--guest': !showSidebar }">
    <div class="row row_lg hleb-cab">
      <div class="col-lg-12">
        <nav itemscope itemtype="https://schema.org/BreadcrumbList">
          <ul class="breadcrumps mb40">
            <li><RouterLink to="/">Главная</RouterLink></li>
            <li class="active">{{ breadcrumbTitle }}</li>
          </ul>
        </nav>
      </div>
    </div>
    <div class="row cabinet-layout">
      <aside v-if="showSidebar" class="col-md-3 col-lg-3 cabinet-aside">
        <ul class="cabinet-nav">
          <li>
            <RouterLink :to="isLegal ? '/account-b2b/profil' : '/account/profil'">Профиль</RouterLink>
          </li>
          <li>
            <RouterLink :to="isLegal ? '/account-b2b/istoriya-zakazov' : '/account/istoriya-zakazov'">
              История заказов
            </RouterLink>
          </li>
          <li class="cabinet-switch">
            <RouterLink v-if="!isLegal" to="/account-b2b/avtorizaciya">Кабинет юр. лиц →</RouterLink>
            <RouterLink v-else to="/account/profil">Кабинет физ. лиц →</RouterLink>
          </li>
          <li><a href="#" @click.prevent="auth.logout()">Выйти</a></li>
        </ul>
      </aside>
      <div
        class="cabinet-main"
        :class="showSidebar ? 'col-md-9 col-lg-9' : 'col-12 cabinet-main--guest'"
      >
        <ul v-if="!showSidebar && isGuestPage" class="cabinet-guest-tabs">
          <li v-if="!isLegal">
            <RouterLink to="/account/avtorizaciya">Вход</RouterLink>
          </li>
          <li v-if="!isLegal">
            <RouterLink to="/account/registraciya">Регистрация</RouterLink>
          </li>
          <li v-if="isLegal">
            <RouterLink to="/account-b2b/avtorizaciya">Вход</RouterLink>
          </li>
          <li class="cabinet-switch-inline">
            <RouterLink v-if="!isLegal" to="/account-b2b/avtorizaciya">Кабинет юр. лиц →</RouterLink>
            <RouterLink v-else to="/account/avtorizaciya">Кабинет физ. лиц →</RouterLink>
          </li>
        </ul>
        <RouterView />
      </div>
    </div>
  </div>
</template>

<style scoped>
.cabinet-page {
  padding-bottom: 60px;
}

.cabinet-layout {
  align-items: flex-start;
}

.cabinet-guest-tabs {
  list-style: none;
  padding: 0;
  margin: 0 0 24px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px 16px;
}

.cabinet-guest-tabs a {
  display: inline-block;
  padding: 8px 16px;
  border-radius: 50px;
  background: #faf3e9;
  color: #413836;
  text-decoration: none;
  font-size: 14px;
}

.cabinet-guest-tabs a.router-link-active {
  background: #517b39;
  color: #fff;
  font-weight: 600;
}

.cabinet-switch-inline {
  margin-left: auto;
}
</style>
