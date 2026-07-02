<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useAuthStore } from '@/stores/auth'

const props = defineProps<{ legal?: boolean }>()
const auth = useAuthStore()

const form = ref({
  firstName: '',
  lastName: '',
  middleName: '',
  birthDate: '',
  phone: '',
  street: '',
  apartment: '',
  floor: '',
  entrance: '',
  doorCode: '',
  notifyEmail: true,
  notifyPhone: true,
  password: '',
  currentPassword: '',
  newPassword: '',
  repeatPassword: '',
  inn: '',
  bank: '',
  rs: '',
  ks: '',
  bik: '',
})

const showPassword = ref(false)
const message = ref('')
const error = ref('')

const user = computed(() => auth.user)

function loadFromUser() {
  const u = auth.user
  if (!u) return
  const ext = u.extended ?? {}
  form.value.firstName = String(ext.firstName ?? u.fullname?.split(' ')[0] ?? '')
  form.value.lastName = String(ext.lastName ?? u.fullname?.split(' ')[1] ?? '')
  form.value.middleName = String(ext.middleName ?? '')
  form.value.birthDate = String(ext.birthDate ?? '')
  form.value.phone = String(u.phone ?? ext.phone ?? '')
  form.value.street = String(ext.street ?? '')
  form.value.apartment = String(ext.apartment ?? '')
  form.value.floor = String(ext.floor ?? '')
  form.value.entrance = String(ext.entrance ?? '')
  form.value.doorCode = String(ext.doorCode ?? '')
  form.value.notifyEmail = ext.notifyEmail !== false
  form.value.notifyPhone = ext.notifyPhone !== false
  form.value.inn = String(ext.inn ?? '')
  form.value.bank = String(ext.bank ?? '')
  form.value.rs = String(ext.rs ?? '')
  form.value.ks = String(ext.ks ?? '')
  form.value.bik = String(ext.bik ?? '')
}

watch(user, loadFromUser, { immediate: true })
onMounted(async () => {
  if (!auth.loaded) await auth.loadMe()
  loadFromUser()
})

async function savePersonal() {
  error.value = ''
  message.value = ''
  try {
    const fullname = [form.value.firstName, form.value.lastName].filter(Boolean).join(' ')
    await auth.saveProfile({
      fullname,
      phone: form.value.phone,
      accountType: props.legal ? 'legal' : 'personal',
      extended: {
        firstName: form.value.firstName,
        lastName: form.value.lastName,
        middleName: form.value.middleName,
        birthDate: form.value.birthDate,
        phone: form.value.phone,
        street: form.value.street,
        apartment: form.value.apartment,
        floor: form.value.floor,
        entrance: form.value.entrance,
        doorCode: form.value.doorCode,
        notifyEmail: form.value.notifyEmail,
        notifyPhone: form.value.notifyPhone,
        inn: form.value.inn,
        bank: form.value.bank,
        rs: form.value.rs,
        ks: form.value.ks,
        bik: form.value.bik,
      },
    })
    message.value = 'Информация обновлена!'
  } catch {
    error.value = 'Не удалось сохранить'
  }
}

async function savePassword() {
  error.value = ''
  try {
    await auth.changePassword(form.value.currentPassword, form.value.newPassword, form.value.repeatPassword)
    message.value = 'Пароль изменён'
    form.value.currentPassword = ''
    form.value.newPassword = ''
    form.value.repeatPassword = ''
  } catch {
    error.value = 'Ошибка смены пароля'
  }
}

function togglePassword() {
  showPassword.value = !showPassword.value
}
</script>

<template>
  <div class="row block-data">
    <div v-if="message" class="col-12"><div class="alert alert-success">{{ message }}</div></div>
    <div v-if="error" class="col-12"><div class="alert alert-danger">{{ error }}</div></div>

    <div class="col-md-3"><p class="bold">{{ legal ? 'Контактное лицо' : 'Личные данные' }}</p></div>
    <div class="col-md-7">
      <form @submit.prevent="savePersonal">
        <div v-if="!legal" class="fl-data">
          <div class="input-block">
            <label>Имя</label><br />
            <input v-model="form.firstName" class="input-dat" type="text" placeholder="Ваше имя" required />
          </div>
          <div class="input-block">
            <label>Фамилия</label><br />
            <input v-model="form.lastName" class="input-dat s" type="text" placeholder="Ваша фамилия" />
          </div>
        </div>
        <template v-else>
          <label>Имя</label><br />
          <input v-model="form.firstName" class="input-dat s" placeholder="Имя" /><br /><br />
          <label>Фамилия</label><br />
          <input v-model="form.lastName" class="input-dat s" placeholder="Фамилия" /><br /><br />
        </template>
        <label>Отчество</label><br />
        <input v-model="form.middleName" class="input-dat s" placeholder="Отчество" /><br /><br />
        <template v-if="!legal">
          <label>Дата рождения</label>
          <input v-model="form.birthDate" type="date" class="input-dat s" /><br /><br />
          <div class="fl-phone">
            <div class="phn">
              <label>Телефон*</label><br />
              <input v-model="form.phone" class="input-dat ss" placeholder="+7 (__)__-__-__" type="tel" />
            </div>
          </div>
          <br />
        </template>
        <input class="submits" type="submit" value="Сохранить изменения" />
      </form>
      <div class="divider" />
    </div>

    <div class="col-md-3"><p class="bold">Адрес</p></div>
    <div class="col-md-7">
      <form @submit.prevent="savePersonal">
        <div class="input-container">
          <label>Улица</label><br />
          <input v-model="form.street" class="input-dat s" type="text" placeholder="Например, Санкт-Петербург, улица Савушкина, 141" />
          <span class="icon"><img src="/assets/images/edit.svg" alt="" /></span>
        </div>
        <br /><br />
        <div class="fl-phone">
          <div class="phn">
            <label>Квартира, Этаж</label><br />
            <div class="fl-input">
              <div><input v-model="form.apartment" class="input-dat sss" placeholder="Номер квартиры" /></div>
              <div><input v-model="form.floor" class="input-dat ssss" placeholder="Этаж" /></div>
            </div>
          </div>
          <div class="kod">
            <label>Подъезд, Код двери</label><br />
            <div class="fl-input">
              <div><input v-model="form.entrance" class="input-dat sss" placeholder="Подъезд" /></div>
              <div><input v-model="form.doorCode" class="input-dat ssss" placeholder="Код двери" /></div>
            </div>
          </div>
        </div>
        <br />
        <input class="submits" type="submit" value="Сохранить изменения" />
      </form>
      <div class="divider" />
    </div>

    <template v-if="legal">
      <div class="col-md-3"><p class="bold">Банковские реквизиты</p></div>
      <div class="col-md-7">
        <form @submit.prevent="savePersonal">
          <label>ИНН</label><br /><input v-model="form.inn" class="input-dat s" /><br /><br />
          <label>Банк</label><br /><input v-model="form.bank" class="input-dat s" /><br /><br />
          <label>Р/с (12 цифр)</label><br /><input v-model="form.rs" class="input-dat s" /><br />
          <label>К/с (12 цифр)</label><br /><input v-model="form.ks" class="input-dat s" /><br />
          <label>БИК (9 цифр)</label><br /><input v-model="form.bik" class="input-dat s" /><br /><br />
          <input class="submits" type="submit" value="Сохранить изменения" />
        </form>
        <div class="divider" />
      </div>
    </template>

    <template v-if="!legal">
      <div class="col-md-3"><p class="bold">Настройка уведомлений</p></div>
      <div class="col-md-7">
        <div class="push">
          <div class="push-text"><p>Email</p><p class="texts">Получать уведомления</p></div>
          <label class="checkbox-ios"><input v-model="form.notifyEmail" type="checkbox" /><span class="checkbox-ios-switch" /></label>
        </div>
        <br />
        <div class="push">
          <div class="push-text"><p>Телефон</p><p class="texts">Получать уведомления</p></div>
          <label class="checkbox-ios"><input v-model="form.notifyPhone" type="checkbox" /><span class="checkbox-ios-switch" /></label>
        </div>
        <div class="divider" />
      </div>
    </template>

    <div class="col-md-3"><p class="bold">Данные учетной записи</p></div>
    <div class="col-md-7">
      <p id="changepass" style="cursor:pointer" @click="togglePassword">
        Изменить пароль <span><img class="arr-bl" src="/assets/images/arrow.svg" alt="" :style="{ transform: showPassword ? 'rotate(0deg)' : 'rotate(180deg)' }" /></span>
      </p>
      <div v-show="showPassword" id="toggleBlocks">
        <div class="input-container pas">
          <label>Текущий пароль*</label><br />
          <input v-model="form.currentPassword" class="input-dat pas" type="password" />
          <span class="icon"><img src="/assets/images/pas.svg" alt="" /></span>
        </div>
        <br />
        <div class="input-container pas">
          <label>Новый пароль*</label><br />
          <input v-model="form.newPassword" class="input-dat pas" type="password" />
        </div><br />
        <div class="input-container pas">
          <label>Повторите пароль</label><br />
          <input v-model="form.repeatPassword" class="input-dat pas" type="password" />
        </div><br />
        <input class="submits" type="button" value="Сохранить изменения" @click="savePassword" />
      </div>
      <div class="divider" /><br />
      <p class="bold">Удалить учетную запись</p>
      <p class="del-text">Это невозможно отменить. Все созданные вами данные будут удалены навсегда.</p>
      <div class="del-but">Удалить</div>
    </div>
  </div>
</template>

<style scoped>
.hiddens { display: none; }
#toggleBlocks { margin-top: 12px; }
</style>
