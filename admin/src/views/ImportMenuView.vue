<script setup lang="ts">
import { ref } from 'vue'
import axios from 'axios'

const loading = ref(false)
const result = ref('')
const error = ref('')

async function importFromJson() {
  loading.value = true
  error.value = ''
  result.value = ''
  try {
    const { data } = await axios.post('/api/admin/import/weekly-json', {}, { withCredentials: true })
    result.value = `Импорт завершён: создано блюд ${data.productsCreated}, обновлено ${data.productsUpdated}, позиций в меню ${data.weeklyItems}`
  } catch (e: unknown) {
    error.value = 'Не удалось импортировать. Сначала запустите parse_menu_xlsx.py или положите weekly-menu.json'
    console.error(e)
  } finally {
    loading.value = false
  }
}

async function onFile(e: Event) {
  const input = e.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return
  loading.value = true
  error.value = ''
  result.value = ''
  try {
    const fd = new FormData()
    fd.append('file', file)
    const { data } = await axios.post('/api/admin/import/weekly-json', fd, {
      withCredentials: true,
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    result.value = `Импорт JSON: создано ${data.productsCreated}, обновлено ${data.productsUpdated}, позиций ${data.weeklyItems}`
  } catch {
    error.value = 'Ошибка импорта JSON'
  } finally {
    loading.value = false
    input.value = ''
  }
}
</script>

<template>
  <div>
    <h1>Импорт меню из Excel</h1>
    <div class="card">
      <h2>Шаг 1 — Excel → JSON</h2>
      <p class="muted">Конвертируйте файл «МЕНЮ 1 и 2 СМЕНА.xlsx»:</p>
      <pre class="code">python d:\smachnay\tools\parse_menu_xlsx.py "путь\к\файлу.xlsx"</pre>

      <h2>Шаг 2 — JSON → админка</h2>
      <p class="muted">Загрузите полученный weekly-menu.json или импортируйте стандартный файл из assets.</p>
      <div class="actions">
        <button type="button" class="btn" :disabled="loading" @click="importFromJson">Импорт из assets/data/weekly-menu.json</button>
        <label class="btn btn-outline file-btn">
          Загрузить JSON
          <input type="file" accept=".json,application/json" hidden @change="onFile" />
        </label>
      </div>
      <p v-if="result" class="ok">{{ result }}</p>
      <p v-if="error" class="error">{{ error }}</p>
    </div>
  </div>
</template>

<style scoped>
.muted { color: var(--muted); }
.code { background: var(--chip); padding: 12px; border-radius: 8px; overflow-x: auto; font-size: 13px; }
.actions { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 16px; }
.btn-outline { background: transparent; border: 1px solid var(--line); color: var(--muted); cursor: pointer; }
.file-btn { display: inline-block; }
.ok { color: var(--accent); margin-top: 12px; }
.error { color: #d03b1d; margin-top: 12px; }
h2 { font-size: 16px; margin: 20px 0 8px; }
</style>
