<script setup lang="ts">
import AdminLayout from '@/layouts/AdminLayout.vue'
</script>

<template>
  <RouterView v-slot="{ Component, route }">
    <AdminLayout v-if="route.meta.layout !== 'auth'">
      <component :is="Component" />
    </AdminLayout>
    <component :is="Component" v-else />
  </RouterView>
</template>
