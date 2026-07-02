<script setup lang="ts">
import SiteHeader from '@/components/layout/SiteHeader.vue'
import SiteFooter from '@/components/layout/SiteFooter.vue'
import { onMounted } from 'vue'
import { useSiteStore } from '@/stores/site'
import { useAuthStore } from '@/stores/auth'

const site = useSiteStore()
const auth = useAuthStore()

onMounted(async () => {
  await site.loadConfig()
  await auth.loadMe()
})
</script>

<template>
  <SiteHeader />
  <main>
    <RouterView />
  </main>
  <SiteFooter />
</template>
