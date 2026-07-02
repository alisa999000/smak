<script setup lang="ts">
import { nextTick, onMounted, ref, watch } from 'vue'
import type { FaqItem } from '@/data/faqContent'

const props = withDefaults(
  defineProps<{
    items: FaqItem[]
    initialOpen?: number | null
  }>(),
  { initialOpen: null },
)

const openIndex = ref<number | null>(props.initialOpen)
const answerHeights = ref<number[]>([])

function measureHeights() {
  const nodes = document.querySelectorAll<HTMLElement>('.faq-accordion__answer-inner')
  answerHeights.value = [...nodes].map((node) => node.scrollHeight)
}

function toggle(index: number) {
  openIndex.value = openIndex.value === index ? null : index
}

watch(
  () => props.items,
  async () => {
    await nextTick()
    measureHeights()
  },
  { deep: true },
)

watch(openIndex, async () => {
  await nextTick()
  measureHeights()
})

onMounted(async () => {
  await nextTick()
  measureHeights()
})
</script>

<template>
  <div class="faq-accordion">
    <div
      v-for="(item, index) in items"
      :key="`${item.q}-${index}`"
      class="faq-accordion__item container_que"
    >
      <button
        type="button"
        class="question faq-accordion__question"
        :class="{ active: openIndex === index }"
        :aria-expanded="openIndex === index"
        @click="toggle(index)"
      >
        <span>{{ item.q }}</span>
      </button>
      <div
        class="answercont faq-accordion__answercont"
        :style="{ maxHeight: openIndex === index ? `${answerHeights[index] ?? 0}px` : '0px' }"
      >
        <div class="answer faq-accordion__answer faq-accordion__answer-inner">{{ item.a }}</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.faq-accordion {
  border: 1px solid #ece7df;
  border-radius: 20px;
  overflow: hidden;
  background: #fff;
  box-shadow: 0 8px 32px rgba(44, 39, 36, 0.06);
}

.faq-accordion__item {
  border-top: 1px solid #ebebeb;
}

.faq-accordion__item:first-child {
  border-top: 0;
}

.faq-accordion__question {
  width: 100%;
  border: 0;
  background: transparent;
  text-align: left;
  font-family: Inter, sans-serif;
  font-size: 1.05rem;
  font-weight: 600;
  line-height: 1.45;
  color: #2c2724;
  padding: 22px 72px 22px 24px;
  position: relative;
  display: flex;
  align-items: center;
  cursor: pointer;
  transition: background 0.2s ease, color 0.2s ease;
}

.faq-accordion__question:hover {
  background: #faf7f2;
}

.faq-accordion__question.active {
  color: #517b39;
  background: #faf3e9;
}

.faq-accordion__question::after {
  content: '+';
  font-size: 2rem;
  font-weight: 400;
  line-height: 1;
  position: absolute;
  right: 24px;
  top: 50%;
  transform: translateY(-50%);
  color: #517b39;
  transition: transform 0.2s ease;
}

.faq-accordion__question.active::after {
  transform: translateY(-50%) rotate(45deg);
}

.faq-accordion__answercont {
  overflow: hidden;
  transition: max-height 0.3s ease;
}

.faq-accordion__answer {
  padding: 0 24px 24px;
  font-size: 15px;
  line-height: 1.65;
  color: #5c5651;
}

@media (max-width: 575px) {
  .faq-accordion__question {
    font-size: 1rem;
    padding: 18px 56px 18px 18px;
  }

  .faq-accordion__answer {
    padding: 0 18px 18px;
    font-size: 14px;
  }
}
</style>
