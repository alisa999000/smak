<script setup lang="ts">
import { homeComplex } from '@/data/homeContent'
import { ORDER_SYSTEM_URL } from '@/data/siteDefaults'

const complexImage = '/assets/images/home-complex-web.jpg'
</script>

<template>
  <section class="home-complex">
    <div class="home-complex__grid">
      <article class="home-complex__card home-complex__card--menu">
        <p class="home-complex__eyebrow">Состав комплекса</p>
        <h2 class="home-complex__title">{{ homeComplex.title }}</h2>
        <p class="home-complex__subtitle">{{ homeComplex.compositionTitle }}</p>
        <ul class="home-complex__menu">
          <li v-for="(item, i) in homeComplex.composition" :key="i">
            <span class="home-complex__menu-icon" aria-hidden="true" />
            <span>{{ item }}</span>
          </li>
        </ul>
      </article>

      <div class="home-complex__media">
        <img :src="complexImage" alt="Комплексный обед" width="1400" height="933" loading="lazy" />
      </div>

      <article class="home-complex__card home-complex__card--info">
        <ul class="home-complex__features">
          <li v-for="(line, i) in homeComplex.details" :key="i">
            <span class="home-complex__feature-dot" aria-hidden="true" />
            <span>{{ line }}</span>
          </li>
        </ul>

        <div class="home-complex__footer">
          <div class="home-complex__price">
            <span class="home-complex__price-label">от</span>
            <span class="home-complex__price-value">{{ homeComplex.priceFrom }}</span>
            <span class="home-complex__price-currency">₽</span>
            <span class="home-complex__price-note">за комплекс</span>
          </div>
          <a
            :href="ORDER_SYSTEM_URL"
            class="home-complex__cta"
            target="_blank"
            rel="noopener"
          >
            Оформить заказ
          </a>
        </div>
      </article>
    </div>
  </section>
</template>

<style scoped>
.home-complex {
  margin: 8px 0 56px;
}

.home-complex__grid {
  display: grid;
  grid-template-columns: 1fr 1.05fr 1fr;
  gap: 18px;
  align-items: stretch;
}

.home-complex__card {
  background: #faf3e9;
  border: 1px solid rgba(237, 164, 69, 0.18);
  border-radius: 20px;
  padding: 28px 30px;
  box-shadow: 0 6px 24px rgba(44, 39, 36, 0.05);
}

.home-complex__media {
  overflow: hidden;
  border-radius: 20px;
  background: #f3ece3;
  min-height: 280px;
}

.home-complex__media img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}

.home-complex__eyebrow {
  margin: 0 0 8px;
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: #517b39;
}

.home-complex__title {
  margin: 0 0 10px;
  font-size: clamp(22px, 2.6vw, 30px);
  font-weight: 600;
  line-height: 1.2;
  color: #2c2724;
}

.home-complex__subtitle {
  margin: 0 0 18px;
  font-size: 15px;
  line-height: 1.45;
  color: #6b6560;
}

.home-complex__menu {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.home-complex__menu li {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 10px 12px;
  background: rgba(255, 255, 255, 0.55);
  border-radius: 12px;
  font-size: 14px;
  line-height: 1.4;
  color: #2c2724;
}

.home-complex__menu-icon {
  flex-shrink: 0;
  width: 20px;
  height: 20px;
  margin-top: 1px;
  border-radius: 50%;
  background: rgba(81, 123, 57, 0.12);
  position: relative;
}

.home-complex__menu-icon::after {
  content: '';
  position: absolute;
  left: 6px;
  top: 3px;
  width: 5px;
  height: 9px;
  border: solid #517b39;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

.home-complex__card--info {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.home-complex__features {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.home-complex__features li {
  display: flex;
  gap: 12px;
  align-items: flex-start;
  font-size: 15px;
  line-height: 1.5;
  color: #413836;
}

.home-complex__feature-dot {
  flex-shrink: 0;
  width: 8px;
  height: 8px;
  margin-top: 7px;
  border-radius: 50%;
  background: #517b39;
}

.home-complex__footer {
  margin-top: 24px;
  padding-top: 20px;
  border-top: 1px solid rgba(237, 164, 69, 0.25);
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.home-complex__price {
  display: flex;
  align-items: baseline;
  flex-wrap: wrap;
  gap: 4px 6px;
  color: #2c2724;
}

.home-complex__price-label {
  font-size: 15px;
  color: #6b6560;
}

.home-complex__price-value {
  font-size: 34px;
  font-weight: 700;
  line-height: 1;
  color: #517b39;
}

.home-complex__price-currency {
  font-size: 20px;
  font-weight: 600;
  color: #517b39;
}

.home-complex__price-note {
  flex: 1 0 100%;
  font-size: 13px;
  color: #6b6560;
}

.home-complex__cta {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 48px;
  padding: 0 24px;
  border-radius: 999px;
  background: #517b39;
  color: #fff;
  font-size: 16px;
  font-weight: 600;
  text-decoration: none;
  transition: background 0.15s ease, transform 0.15s ease;
}

.home-complex__cta:hover {
  background: #3f5f2d;
  transform: translateY(-1px);
}

@media (max-width: 1199px) {
  .home-complex__grid {
    grid-template-columns: 1fr 1fr;
  }

  .home-complex__media {
    grid-column: 1 / -1;
    min-height: 320px;
  }
}

@media (max-width: 767px) {
  .home-complex__grid {
    grid-template-columns: 1fr;
  }

  .home-complex__media {
    min-height: 220px;
  }

  .home-complex__card {
    padding: 22px 18px;
  }
}
</style>
