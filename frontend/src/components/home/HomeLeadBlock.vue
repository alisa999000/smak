<script setup lang="ts">
import { ref } from 'vue'
import { homeFeedback, homeSeo } from '@/data/homeContent'
import { sendFeedback } from '@/api/client'

const feedback = ref({ people: '1', name: '', phone: '' })
const consent = ref(false)
const feedbackSent = ref(false)
const feedbackError = ref('')
const sending = ref(false)

async function submitFeedback(e: Event) {
  e.preventDefault()
  feedbackError.value = ''

  if (!consent.value) {
    feedbackError.value = 'Подтвердите согласие на обработку данных'
    return
  }

  sending.value = true
  try {
    await sendFeedback(feedback.value)
    feedbackSent.value = true
  } catch {
    feedbackError.value = 'Не удалось отправить заявку. Попробуйте позже или позвоните нам.'
  } finally {
    sending.value = false
  }
}
</script>

<template>
  <section class="home-lead" id="lead">
    <div class="home-lead__seo">
      <h2 class="home-lead__seo-title">{{ homeSeo.title }}</h2>
      <p class="home-lead__seo-text">{{ homeSeo.text }}</p>
    </div>

    <div class="home-lead__panel">
      <header class="home-lead__header">
        <h3 class="home-lead__title">{{ homeFeedback.title }}</h3>
        <p class="home-lead__lead">{{ homeFeedback.lead }}</p>
      </header>

      <form class="home-lead__form" @submit="submitFeedback">
        <div class="home-lead__grid">
          <label class="home-lead__field">
            <span class="home-lead__label">Кол-во человек</span>
            <select v-model="feedback.people" class="home-lead__input">
              <option v-for="n in 10" :key="n" :value="String(n)">{{ n }}</option>
              <option value="10+">Более 10</option>
            </select>
          </label>

          <label class="home-lead__field">
            <span class="home-lead__label">Ваше имя</span>
            <input
              v-model="feedback.name"
              type="text"
              class="home-lead__input"
              placeholder="Как к вам обращаться"
              required
            />
          </label>

          <label class="home-lead__field">
            <span class="home-lead__label">Телефон для перезвона</span>
            <input
              v-model="feedback.phone"
              type="tel"
              class="home-lead__input"
              placeholder="+7 (___) ___-__-__"
              required
            />
          </label>

          <div class="home-lead__field home-lead__field--submit">
            <span class="home-lead__label home-lead__label--hidden">Отправить</span>
            <button type="submit" class="home-lead__submit" :disabled="sending">
              {{ sending ? 'Отправка…' : homeFeedback.submit }}
            </button>
          </div>
        </div>

        <label class="home-lead__consent">
          <input v-model="consent" type="checkbox" required />
          <span>
            {{ homeFeedback.consent }}
            <RouterLink to="/polzovatelskoe-soglashenie" target="_blank">{{ homeFeedback.consentLink }}</RouterLink>
          </span>
        </label>

        <p v-if="feedbackSent" class="home-lead__message home-lead__message--ok">{{ homeFeedback.success }}</p>
        <p v-if="feedbackError" class="home-lead__message home-lead__message--err">{{ feedbackError }}</p>
      </form>
    </div>
  </section>
</template>

<style scoped>
.home-lead {
  border-radius: 20px;
  overflow: hidden;
  margin: 50px 0 70px;
  box-shadow: 0 8px 32px rgba(44, 39, 36, 0.08);
}

.home-lead__seo {
  background: #faf3e9;
  padding: 36px 40px;
  border-bottom: 1px solid rgba(237, 164, 69, 0.25);
}

.home-lead__seo-title {
  margin: 0 0 14px;
  font-size: clamp(22px, 3vw, 28px);
  font-weight: 600;
  line-height: 1.3;
  color: #2c2724;
}

.home-lead__seo-text {
  margin: 0;
  max-width: 920px;
  font-size: 16px;
  line-height: 1.6;
  color: #413836;
}

.home-lead__panel {
  background: #eda445;
  padding: 36px 32px 40px;
}

.home-lead__header {
  text-align: center;
  max-width: 720px;
  margin: 0 auto 28px;
}

.home-lead__title {
  margin: 0 0 10px;
  font-size: clamp(24px, 3.5vw, 32px);
  font-weight: 600;
  line-height: 1.25;
  color: #fff;
}

.home-lead__lead {
  margin: 0;
  font-size: 17px;
  line-height: 1.45;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.96);
}

.home-lead__form {
  max-width: 1040px;
  margin: 0 auto;
}

.home-lead__grid {
  display: grid;
  grid-template-columns: minmax(120px, 0.85fr) minmax(0, 1.2fr) minmax(0, 1.2fr) minmax(160px, 0.9fr);
  gap: 16px;
  align-items: end;
}

.home-lead__field {
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 0;
}

.home-lead__label {
  font-size: 14px;
  font-weight: 500;
  line-height: 1.2;
  color: #fff;
}

.home-lead__label--hidden {
  visibility: hidden;
}

.home-lead__input,
.home-lead__submit {
  width: 100%;
  height: 48px;
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.35);
  font: inherit;
  font-size: 15px;
}

.home-lead__input {
  padding: 0 14px;
  background: #fff;
  color: #2c2724;
}

.home-lead__input:focus {
  outline: 2px solid rgba(44, 39, 36, 0.25);
  outline-offset: 1px;
}

.home-lead__submit {
  padding: 0 20px;
  background: #2c2724;
  color: #fff;
  font-weight: 600;
  cursor: pointer;
  border: none;
  transition: background 0.15s ease;
}

.home-lead__submit:hover:not(:disabled) {
  background: #141313;
}

.home-lead__submit:disabled {
  opacity: 0.7;
  cursor: wait;
}

.home-lead__consent {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  margin: 18px 0 0;
  font-size: 13px;
  line-height: 1.5;
  color: #fff;
  cursor: pointer;
}

.home-lead__consent input {
  width: 18px;
  height: 18px;
  margin-top: 2px;
  flex-shrink: 0;
  accent-color: #2c2724;
}

.home-lead__consent a {
  color: #fff;
  text-decoration: underline;
}

.home-lead__message {
  margin: 14px 0 0;
  padding: 12px 16px;
  border-radius: 10px;
  text-align: center;
  font-size: 14px;
  font-weight: 500;
}

.home-lead__message--ok {
  background: rgba(81, 123, 57, 0.25);
  color: #fff;
}

.home-lead__message--err {
  background: rgba(208, 59, 29, 0.85);
  color: #fff;
}

@media (max-width: 991px) {
  .home-lead__grid {
    grid-template-columns: 1fr 1fr;
  }

  .home-lead__field--submit {
    grid-column: 1 / -1;
  }

  .home-lead__label--hidden {
    display: none;
  }
}

@media (max-width: 575px) {
  .home-lead__seo,
  .home-lead__panel {
    padding-left: 20px;
    padding-right: 20px;
  }

  .home-lead__grid {
    grid-template-columns: 1fr;
  }

  .home-lead__field--submit {
    grid-column: auto;
  }
}
</style>
