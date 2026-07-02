<script setup lang="ts">
import PageLayout from '@/components/layout/PageLayout.vue'
</script>

<template>
  <PageLayout title="Страница не найдена">
    <p class="page-content">Запрашиваемая страница не существует или была удалена.</p>
    <RouterLink to="/" class="submits">На главную</RouterLink>
  </PageLayout>
</template>
