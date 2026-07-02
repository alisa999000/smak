<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { homePromoSlides } from '@/data/homeContent'

const index = ref(0)
let timer: ReturnType<typeof setInterval> | undefined

function goTo(i: number) {
  index.value = i
}

onMounted(() => {
  timer = setInterval(() => {
    index.value = (index.value + 1) % homePromoSlides.length
  }, 7000)
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})
</script>

<template>
  <div class="promo_slider home-promo-carousel">
    <div
      v-for="(slide, i) in homePromoSlides"
      :key="slide.title"
      class="block_action home-promo-carousel__slide"
      :class="{ 'home-promo-carousel__slide--active': i === index }"
    >
      <div class="block_data_action">{{ slide.badge }}</div>
      <div class="block_title_action">{{ slide.title }}</div>
      <div class="block_text_action">{{ slide.text }}</div>
    </div>

    <div class="home-promo-carousel__dots" role="tablist" aria-label="Промо-слайды">
      <button
        v-for="(_, i) in homePromoSlides"
        :key="i"
        type="button"
        class="home-promo-carousel__dot"
        :class="{ 'home-promo-carousel__dot--active': i === index }"
        :aria-selected="i === index"
        :aria-label="`Слайд ${i + 1}`"
        @click="goTo(i)"
      />
    </div>
  </div>
</template>

<style scoped>
.home-promo-carousel {
  position: relative;
  padding-bottom: 48px;
}

.home-promo-carousel__slide {
  display: none;
  min-height: 280px;
}

.home-promo-carousel__slide--active {
  display: block;
}

.home-promo-carousel__dots {
  position: absolute;
  left: 30px;
  right: 30px;
  bottom: 20px;
  display: flex;
  gap: 8px;
}

.home-promo-carousel__dot {
  flex: 1;
  height: 4px;
  padding: 0;
  border: none;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.45);
  cursor: pointer;
  transition: background 0.2s;
}

.home-promo-carousel__dot--active {
  background: #2c2724;
}
</style>
