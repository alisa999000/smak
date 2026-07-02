<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const router = useRouter()
const route = useRoute()

const fullname = ref(String(route.query.email ?? ''))
const email = ref(String(route.query.email ?? ''))
const phone = ref('')
const password = ref('')
const repeatPassword = ref('')
const error = ref('')
const success = ref('')

async function submit() {
  error.value = ''
  if (password.value !== repeatPassword.value) {
    error.value = 'Пароли не совпадают'
    return
  }
  try {
    await auth.register({
      fullname: fullname.value,
      email: email.value,
      phone: phone.value,
      password: password.value,
      username: email.value,
    })
    success.value = `Поздравляем с успешной регистрацией, ${fullname.value}!`
    setTimeout(() => router.push('/account/profil'), 1500)
  } catch {
    error.value = 'Ошибка регистрации. Проверьте данные.'
  }
}
</script>

<template>
  <div>
    <h1 class="tit-main">Регистрация</h1>
    <div v-if="success" class="alert alert-success">{{ success }}</div>
    <div class="account_form">
      <form @submit.prevent="submit">
        <div class="form-group">
          <label>* Имя</label>
          <input v-model="fullname" type="text" class="form-control" placeholder="Имя" required />
        </div>
        <div class="form-group">
          <label>* Email</label>
          <input v-model="email" type="email" class="form-control" placeholder="Email" required />
        </div>
        <div class="form-group">
          <label>Телефон</label>
          <input v-model="phone" type="tel" class="form-control" placeholder="+7..." />
        </div>
        <div class="form-group">
          <label>* Пароль</label>
          <input v-model="password" type="password" class="form-control" required />
        </div>
        <div class="form-group">
          <label>* Повторите пароль</label>
          <input v-model="repeatPassword" type="password" class="form-control" required />
        </div>
        <div v-if="error" class="alert alert-danger">{{ error }}</div>
        <button type="submit" class="btn btn-primary submits">Зарегистрироваться</button>
      </form>
    </div>
  </div>
</template>
