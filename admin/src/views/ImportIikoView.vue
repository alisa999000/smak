<script setup lang="ts">
import { ref } from 'vue'
import { importIiko } from '@/api/client'

const loading = ref(false)
const result = ref('')

async function run() {
  loading.value = true
  result.value = ''
  try {
    const data = await importIiko()
    result.value = JSON.stringify(data, null, 2)
  } catch (e: unknown) {
    result.value = 'Ошибка импорта. Проверьте IIKO_* в .env menu-crm.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div>
    <h1>Импорт iiko</h1>
    <p class="muted">Загрузка номенклатуры из iiko Cloud в CRM</p>
    <button type="button" class="btn" :disabled="loading" @click="run">
      {{ loading ? 'Импорт…' : 'Запустить импорт' }}
    </button>
    <pre v-if="result" class="card result">{{ result }}</pre>
  </div>
</template>

<style scoped>
.muted { color: var(--muted); }
.result { margin-top: 16px; overflow: auto; font-size: 12px; }
</style>
