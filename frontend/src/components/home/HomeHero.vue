<script setup lang="ts">
import { homeHero } from '@/data/homeContent'
import { ORDER_ACCEPT_UNTIL } from '@/data/siteDefaults'

const orderLine = `Принимаем заказы ежедневно до ${ORDER_ACCEPT_UNTIL} на следующий день`
const titleImage = '/assets/images/home-hero-title-web.jpg'
</script>

<template>
  <section class="home-hero">
    <div class="home-hero__copy">
      <p class="home-hero__eyebrow">{{ homeHero.eyebrow }}</p>
      <h1 class="home-hero__title">{{ homeHero.title }}</h1>
      <p class="home-hero__desc">{{ orderLine }}</p>
    </div>
    <div class="home-hero__media">
      <img :src="titleImage" :alt="homeHero.title" width="1600" height="1066" loading="eager" />
    </div>
  </section>
</template>

<style scoped>
.home-hero {
  margin: 8px 0 40px;
}

.home-hero__copy {
  max-width: 720px;
  margin-bottom: 28px;
}

.home-hero__eyebrow {
  margin: 0 0 10px;
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: #517b39;
}

.home-hero__title {
  margin: 0 0 14px;
  font-size: clamp(28px, 4.2vw, 42px);
  font-weight: 600;
  line-height: 1.15;
  color: #2c2724;
}

.home-hero__desc {
  margin: 0;
  font-size: 17px;
  line-height: 1.5;
  color: #6b6560;
}

.home-hero__media {
  overflow: hidden;
  border-radius: 20px;
  background: #f3ece3;
}

.home-hero__media img {
  display: block;
  width: 100%;
  height: auto;
  max-height: min(52vh, 520px);
  object-fit: cover;
  object-position: center;
}

@media (max-width: 767px) {
  .home-hero {
    margin-bottom: 28px;
  }

  .home-hero__copy {
    margin-bottom: 18px;
  }

  .home-hero__media {
    border-radius: 14px;
  }

  .home-hero__media img {
    max-height: 42vh;
  }
}
</style>
