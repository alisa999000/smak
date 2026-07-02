<script setup lang="ts">
import { computed } from 'vue'
import { resolveProductImage } from '@/utils/images'

const props = withDefaults(
  defineProps<{
    src?: string | null
    alt: string
    variant?: 'card' | 'page'
  }>(),
  { variant: 'card' },
)

const imageUrl = computed(() => resolveProductImage(props.src))
</script>

<template>
  <div class="product-image" :class="[`product-image--${variant}`, { 'product-image--empty': !imageUrl }]">
    <img v-if="imageUrl" :src="imageUrl" :alt="alt" loading="lazy" />
    <div v-else class="product-image__placeholder">
      <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M4 16l4.5-4.5a2 2 0 0 1 2.8 0L16 16M14 14l1.5-1.5a2 2 0 0 1 2.8 0L20 15M3 6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6z"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
      <span>Нет фото</span>
    </div>
  </div>
</template>

<style scoped>
.product-image {
  position: relative;
  overflow: hidden;
  border-radius: 16px;
  background: #f0ebe3;
}

.product-image--card {
  aspect-ratio: 4 / 3;
}

.product-image--page {
  aspect-ratio: 4 / 3;
  max-height: 420px;
  border-radius: 20px;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.product-image__placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  height: 100%;
  min-height: 140px;
  color: #a89f96;
  font-size: 13px;
  font-weight: 500;
  background: linear-gradient(145deg, #f5efe6 0%, #ebe3d8 100%);
}

.product-image__placeholder svg {
  opacity: 0.55;
}
</style>
