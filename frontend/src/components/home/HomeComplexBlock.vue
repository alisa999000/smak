<script setup lang="ts">
import { homeComplex } from '@/data/homeContent'
import { ORDER_SYSTEM_URL } from '@/data/siteDefaults'
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
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  align-items: stretch;
}

.home-complex__card {
  background: #faf3e9;
  border: 1px solid rgba(237, 164, 69, 0.18);
  border-radius: 20px;
  padding: 32px 36px;
  box-shadow: 0 6px 24px rgba(44, 39, 36, 0.05);
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
  font-size: clamp(24px, 3vw, 32px);
  font-weight: 600;
  line-height: 1.2;
  color: #2c2724;
}

.home-complex__subtitle {
  margin: 0 0 20px;
  font-size: 16px;
  line-height: 1.45;
  color: #6b6560;
}

.home-complex__menu {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.home-complex__menu li {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px 14px;
  background: rgba(255, 255, 255, 0.55);
  border-radius: 12px;
  font-size: 15px;
  line-height: 1.4;
  color: #2c2724;
}

.home-complex__menu-icon {
  flex-shrink: 0;
  width: 22px;
  height: 22px;
  margin-top: 1px;
  border-radius: 50%;
  background: rgba(81, 123, 57, 0.12);
  position: relative;
}

.home-complex__menu-icon::after {
  content: '';
  position: absolute;
  left: 7px;
  top: 4px;
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
  gap: 16px;
}

.home-complex__features li {
  display: flex;
  gap: 12px;
  align-items: flex-start;
  font-size: 16px;
  line-height: 1.55;
  color: #413836;
}

.home-complex__feature-dot {
  flex-shrink: 0;
  width: 8px;
  height: 8px;
  margin-top: 8px;
  border-radius: 50%;
  background: #517b39;
}

.home-complex__footer {
  margin-top: 28px;
  padding-top: 24px;
  border-top: 1px solid rgba(237, 164, 69, 0.25);
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
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
  font-size: 36px;
  font-weight: 700;
  line-height: 1;
  color: #517b39;
}

.home-complex__price-currency {
  font-size: 22px;
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
  min-width: 200px;
  height: 48px;
  padding: 0 28px;
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

@media (max-width: 991px) {
  .home-complex__grid {
    grid-template-columns: 1fr;
  }

  .home-complex__footer {
    flex-direction: column;
    align-items: stretch;
  }

  .home-complex__cta {
    width: 100%;
  }
}

@media (max-width: 575px) {
  .home-complex__card {
    padding: 24px 20px;
  }
}
</style>
