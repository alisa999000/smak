<script setup lang="ts">
import { ref, watch } from 'vue'
import { useSiteStore } from '@/stores/site'

const props = defineProps<{ open: boolean }>()
const emit = defineEmits<{ close: [] }>()

const site = useSiteStore()
const tab = ref<'phone' | 'email'>('phone')
const phone = ref('')
const email = ref('')

watch(() => props.open, (v) => {
  if (v) tab.value = 'phone'
})

function csrf(): string {
  return site.config?.csrfToken ?? ''
}

function postForm(url: string, fields: Record<string, string>) {
  const f = document.createElement('form')
  f.method = 'post'
  f.action = url
  f.style.display = 'none'
  Object.entries(fields).forEach(([k, v]) => {
    const inp = document.createElement('input')
    inp.type = 'hidden'
    inp.name = k
    inp.value = v
    f.appendChild(inp)
  })
  document.body.appendChild(f)
  f.submit()
}

function submitPhone() {
  if (!phone.value.trim()) {
    alert('Введите номер телефона')
    return
  }
  const tok = csrf()
  if (!tok) {
    alert('Обновите страницу (нет CSRF-токена)')
    return
  }
  postForm('/auth/sms/send', { _token: tok, phone: phone.value.trim() })
}

function submitEmail() {
  if (!email.value.trim()) {
    alert('Введите email')
    return
  }
  const base = site.config?.registerUrl ?? '/account/registraciya'
  const u = base.includes('?') ? `${base}&` : `${base}?`
  window.location.href = u + 'email=' + encodeURIComponent(email.value.trim())
}
</script>

<template>
  <div v-show="open" class="modals" id="modals" @click.self="emit('close')">
    <div class="modals-content">
      <span class="closes" @click="emit('close')">&times;</span>
      <h4>Регистрация</h4>
      <p class="akk">Есть аккаунт? <RouterLink to="/account/avtorizaciya" @click="emit('close')">Войти</RouterLink></p>
      <div class="tabs">
        <button type="button" class="tablinks" :class="{ active: tab === 'phone' }" @click="tab = 'phone'">Номер телефона</button>
        <button type="button" class="tablinks" :class="{ active: tab === 'email' }" @click="tab = 'email'">Электронная почта</button>
      </div>
      <div v-show="tab === 'phone'" class="tabcontent active">
        <div class="phn">
          <label>Телефон*</label><br />
          <input v-model="phone" class="input-dat ks" placeholder="+7 (__)__-__-__" type="tel" />
        </div>
        <input class="submits ks" type="button" value="Получить код" @click="submitPhone" />
        <p class="ili">Или продолжить через:</p>
        <div class="soc-seti">
          <a href="/auth/google"><img src="/assets/images/ggl.svg" alt="google" /></a>
          <a href="/auth/yandex"><img src="/assets/images/ya.svg" alt="yandex" /></a>
        </div>
      </div>
      <div v-show="tab === 'email'" class="tabcontent">
        <div class="phn">
          <label>Email*</label><br />
          <input v-model="email" class="input-dat ks" placeholder="example@smachnaya.ru" type="email" />
        </div>
        <input class="submits ks" type="button" value="Продолжить" @click="submitEmail" />
        <p class="ili">Или продолжить через:</p>
        <div class="soc-seti">
          <a href="/auth/google"><img src="/assets/images/ggl.svg" alt="google" /></a>
          <a href="/auth/yandex"><img src="/assets/images/ya.svg" alt="yandex" /></a>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modals { display: block; position: fixed; z-index: 9999; left: 0; top: 0; width: 100%; height: 100%; background: rgba(0,0,0,.4); }
.tabcontent { display: block; }
.tablinks.active { font-weight: 600; }
</style>
