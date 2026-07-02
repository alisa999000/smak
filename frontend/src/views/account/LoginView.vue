<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const router = useRouter()

const email = ref('')
const password = ref('')
const error = ref('')

async function submit() {
  error.value = ''
  try {
    await auth.login(email.value.trim(), password.value)
    router.push('/account/profil')
  } catch {
    error.value = 'Неверный email или пароль'
  }
}
</script>

<template>
  <div>
    <h1 class="tit-main">Авторизация</h1>
    <div class="account_form">
      <form @submit.prevent="submit">
        <div class="form-group">
          <label for="auth_email">* Email</label>
          <input id="auth_email" v-model="email" type="email" class="form-control" placeholder="Email" required />
        </div>
        <div class="form-group">
          <label for="auth_password">* Пароль</label>
          <input id="auth_password" v-model="password" type="password" class="form-control" placeholder="Пароль" required />
        </div>
        <div v-if="error" class="alert alert-danger">{{ error }}</div>
        <div class="form-group">
          <button type="submit" class="btn btn-primary submits">Войти</button>
        </div>
        <div class="text-center">
          <RouterLink to="/account/registraciya">Зарегистрироваться</RouterLink>
        </div>
        <div class="account-social">
          <a href="/auth/google">Google</a>
          <a href="/auth/yandex">Яндекс</a>
        </div>
      </form>
    </div>
  </div>
</template>
