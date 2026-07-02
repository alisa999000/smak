<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { login } from '@/api/client'

const router = useRouter()
const password = ref('')
const error = ref('')

async function submit() {
  error.value = ''
  try {
    await login(password.value)
    router.push('/dashboard')
  } catch {
    error.value = 'Неверный пароль'
  }
}
</script>

<template>
  <div class="login-page">
    <form class="card login-card" @submit.prevent="submit">
      <h1>Смачная · Админка</h1>
      <p class="muted">Вход в CRM меню</p>
      <input v-model="password" type="password" placeholder="Пароль" required />
      <p v-if="error" class="error">{{ error }}</p>
      <button type="submit" class="btn">Войти</button>
    </form>
  </div>
</template>

<style scoped>
.login-page { min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 24px; }
.login-card { width: 100%; max-width: 380px; display: grid; gap: 12px; }
.muted { color: var(--muted); margin: 0; }
.error { color: #d03b1d; margin: 0; }
</style>
