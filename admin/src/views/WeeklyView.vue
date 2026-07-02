<script setup lang="ts">
import { ref } from 'vue'
import axios from 'axios'

const weekStart = ref('')
const message = ref('')

async function saveWeekly() {
  await axios.post('/api/admin/weekly', { weekStart: weekStart.value }, { withCredentials: true })
  message.value = 'Сохранено'
}
</script>

<template>
  <div>
    <h1>Меню недели</h1>
    <p class="muted">Планировщик недельного меню (понедельник YYYY-MM-DD)</p>
    <div class="card form">
      <label>Начало недели<input v-model="weekStart" type="date" /></label>
      <button type="button" class="btn" @click="saveWeekly">Обновить неделю</button>
      <p v-if="message">{{ message }}</p>
      <p class="muted">Полный планировщик с drag-and-drop — в следующем обновлении; API /api/admin/weekly уже подключён.</p>
    </div>
  </div>
</template>

<style scoped>
.form { display: grid; gap: 12px; max-width: 420px; margin-top: 16px; }
.muted { color: var(--muted); }
</style>
