<script setup lang="ts">
const points = [
  'На рынке общественного питания с 2011г',
  'Занимаемся организацией питания для производств, компаний и их сотрудников.',
  'Имеем своё производство и кафе бистро по адресу: Планерная 59, ТРК ЛеоМолл.',
  'Работаем 7 дней в неделю, без выходных.',
]
</script>

<template>
  <section class="who-we-are">
    <header class="who-we-are__head">
      <h2 class="who-we-are__title">Кто мы</h2>
      <RouterLink to="/" class="who-we-are__logo" aria-label="На главную">
        <img src="/image/logo.png" alt="Смачная точка" />
      </RouterLink>
    </header>

    <div class="who-we-are__body">
      <figure class="who-we-are__media">
        <img src="/image/kafe.jpg" alt="Кафе бистро Смачная точка, ТРК ЛеоМолл" loading="lazy" />
      </figure>

      <ul class="who-we-are__list">
        <li v-for="(point, i) in points" :key="i" class="who-we-are__item">
          <span class="who-we-are__arrow" aria-hidden="true">→</span>
          <span class="who-we-are__text">{{ point }}</span>
        </li>
      </ul>
    </div>
  </section>
</template>
