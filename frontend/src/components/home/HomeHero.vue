<script setup lang="ts">
import { computed } from 'vue'
import { homeHero } from '@/data/homeContent'
import { ORDER_ACCEPT_UNTIL } from '@/data/siteDefaults'
import type { Banner } from '@/types/site'

const props = defineProps<{
  banners?: Banner[]
}>()

const bgImage = computed(() => props.banners?.[0]?.image || '/assets/images/banner1.jpg')

const orderLine = computed(
  () => `Принимаем заказы ежедневно до ${ORDER_ACCEPT_UNTIL} на следующий день`,
)
</script>

<template>
  <div
    class="top_slider home-hero"
    :style="{ backgroundImage: `url(${bgImage})` }"
  >
    <div class="home-hero__overlay" aria-hidden="true" />
    <div id="top_slider_info" class="home-hero__info">
      <p class="top_slider_text_top">{{ homeHero.eyebrow }}</p>
      <h1 class="top_slider_title">{{ homeHero.title }}</h1>
      <p class="top_slider_text_desc">{{ orderLine }}</p>
    </div>
  </div>
</template>

<style scoped>
.home-hero {
  background-color: #3f3a40;
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center right;
  overflow: hidden;
}

.home-hero__overlay {
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: linear-gradient(
    90deg,
    rgba(63, 58, 64, 0.94) 0%,
    rgba(63, 58, 64, 0.78) 42%,
    rgba(63, 58, 64, 0.35) 72%,
    rgba(63, 58, 64, 0.15) 100%
  );
}

.home-hero__info {
  position: relative;
  z-index: 1;
}

@media (max-width: 767px) {
  .home-hero__info {
    left: 24px;
    right: 24px;
    max-width: none;
  }

  .home-hero :deep(.top_slider_title) {
    font-size: 28px;
    line-height: 1.15;
  }
}
</style>
