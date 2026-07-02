import { defineStore } from 'pinia'
import { ref } from 'vue'
import { fetchConfig } from '@/api/client'
import type { SiteConfig } from '@/types/site'

export const useSiteStore = defineStore('site', () => {
  const config = ref<SiteConfig | null>(null)
  const loading = ref(false)
  let pending: Promise<void> | null = null

  async function loadConfig() {
    if (config.value) return
    if (pending) {
      await pending
      return
    }

    pending = (async () => {
      loading.value = true
      try {
        config.value = await fetchConfig()
      } finally {
        loading.value = false
        pending = null
      }
    })()

    await pending
  }

  return { config, loading, loadConfig }
})
