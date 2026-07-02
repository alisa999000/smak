<script setup lang="ts">
import { computed } from 'vue'
import { formatDateAjax } from '@/utils/dates'

const props = withDefaults(
  defineProps<{
    date?: Date
  }>(),
  {},
)

const href = computed(() => {
  const params = new URLSearchParams()
  if (props.date) {
    params.set('date', formatDateAjax(props.date))
  }
  const query = params.toString()
  return query ? `/api/site/menu/pdf?${query}` : '/api/site/menu/pdf'
})
</script>

<template>
  <a id="download-button" :href="href" download="menu-smachnaya.pdf">
    <div id="icon"><img src="/image/download.svg" alt="" /></div>
    <span>Скачать меню на текущую неделю</span>
  </a>
</template>
