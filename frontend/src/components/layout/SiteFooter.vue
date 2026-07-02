<script setup lang="ts">
import { computed } from 'vue'
import { useSiteStore } from '@/stores/site'

import {
  DEFAULT_EMAIL,
  DEFAULT_HOURS,
  DEFAULT_PHONE,
} from '@/data/siteDefaults'
import { legalLinks } from '@/data/legalContent'

const site = useSiteStore()
const phone = computed(() => site.config?.phone ?? DEFAULT_PHONE)
const email = computed(() => site.config?.email ?? DEFAULT_EMAIL)
const hours = computed(() => site.config?.hours ?? DEFAULT_HOURS)
const companyName = computed(() => site.config?.company?.name ?? 'ИП Хулуп Виктор Юрьевич')
</script>

<template>
  <footer>
    <div class="bottom_menu">
      <div class="logo">
        <RouterLink to="/"><img src="/image/logo.png" alt="Логотип Смачаная точка" /></RouterLink>
      </div>
      <div class="working-hours_phone footer-contacts">
        <a :href="`tel:${phone.replace(/\D/g, '')}`">{{ phone }}</a>
        <a class="footer-email" :href="`mailto:${email}`">{{ email }}</a>
        <p>{{ hours }}</p>
      </div>
      <nav id="bottom_company" aria-label="Разделы сайта">
        <div class="item"><div class="title"><RouterLink to="/company">О компании</RouterLink></div></div>
        <div class="item"><div class="title"><RouterLink to="/novosti">Новости</RouterLink></div></div>
        <div class="item"><div class="title"><RouterLink to="/chasto-zadavaemy-voprosy">Часто задаваемые вопросы</RouterLink></div></div>
        <div class="item"><div class="title"><RouterLink to="/kontakty">Контакты</RouterLink></div></div>
      </nav>
      <div id="bottom_social">
        <div id="bottom_social_title">Следите за новостями</div>
        <div id="bottom_social_block">
          <div class="item_social"><a href="#" aria-label="YouTube"><img src="/image/youtube.svg" alt="" /></a></div>
          <div class="item_social"><a href="#" aria-label="Instagram"><img src="/image/instagram.svg" alt="" /></a></div>
          <div class="item_social"><a href="#" aria-label="Одноклассники"><img src="/image/odnoklassniki.svg" alt="" /></a></div>
          <div class="item_social"><a href="#" aria-label="Facebook"><img src="/image/facebook.svg" alt="" /></a></div>
          <div class="item_social"><a href="#" aria-label="ВКонтакте"><img src="/image/vk.svg" alt="" /></a></div>
        </div>
      </div>
    </div>

    <div id="bottom_company_footer">
      <div class="footer-bottom-brand">
        <div class="domain_name">smachnaya.ru</div>
        <p class="footer-company-name">{{ companyName }}</p>
        <RouterLink to="/kontakty" class="footer-requisites-link">Реквизиты и контакты</RouterLink>
      </div>
      <div class="menu_info">
        <ul>
          <li v-for="link in legalLinks" :key="link.to">
            <RouterLink :to="link.to">{{ link.label }}</RouterLink>
          </li>
        </ul>
      </div>
      <div class="oplata_info">
        <p>Мы принимаем к оплате</p>
        <img src="/image/oplata.png" alt="Способы оплаты" />
      </div>
    </div>
  </footer>
</template>
