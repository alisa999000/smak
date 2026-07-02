<template>
  <section class="site-card company-requisites">
    <h2 class="site-section-title">{{ company.name }}</h2>
    <dl class="company-requisites__grid">
      <div><dt>ИНН</dt><dd>{{ company.inn }}</dd></div>
      <div><dt>ОГРНИП</dt><dd>{{ company.ogrnip }}</dd></div>
      <div><dt>Расчётный счёт</dt><dd>{{ company.account }}</dd></div>
      <div><dt>Банк</dt><dd>{{ company.bank }}</dd></div>
      <div><dt>БИК</dt><dd>{{ company.bik }}</dd></div>
      <div><dt>Корр. счёт</dt><dd>{{ company.corrAccount }}</dd></div>
      <div><dt>Фактический адрес</dt><dd>{{ company.addressActual }}</dd></div>
      <div><dt>Юридический адрес</dt><dd>{{ company.addressLegal }}</dd></div>
      <div><dt>Email</dt><dd><a :href="`mailto:${email}`">{{ email }}</a></dd></div>
      <div><dt>Телефон</dt><dd><a :href="`tel:${phone.replace(/\D/g, '')}`">{{ phone }}</a></dd></div>
    </dl>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useSiteStore } from '@/stores/site'
import { DEFAULT_EMAIL, DEFAULT_PHONE } from '@/data/siteDefaults'
import type { CompanyDetails } from '@/types/site'

const site = useSiteStore()

const fallback: CompanyDetails = {
  name: 'ИП Хулуп Виктор Юрьевич',
  inn: '781449116450',
  ogrnip: '322784700346810',
  account: '40802810632510002225',
  bank: 'ФИЛИАЛ "САНКТ-ПЕТЕРБУРГСКИЙ" АО "АЛЬФА-БАНК"',
  bik: '044030786',
  corrAccount: '30101810600000000786',
  addressActual: 'ул. Планерная, дом 59А, ТК ЛеоМолл, пом. 461, 4 этаж',
  addressLegal: 'ул. Туристская, дом 23, корпус 5, кв. 97',
}

const company = computed(() => site.config?.company ?? fallback)
const phone = computed(() => site.config?.phone ?? DEFAULT_PHONE)
const email = computed(() => site.config?.email ?? DEFAULT_EMAIL)
</script>
