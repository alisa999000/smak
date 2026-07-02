<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import PageLayout from '@/components/layout/PageLayout.vue'
import FaqAccordion from '@/components/faq/FaqAccordion.vue'
import { fetchPage } from '@/api/client'
import { defaultFaqItems, faqIntro, parseFaqFromHtml } from '@/data/faqContent'
import { DEFAULT_PHONE } from '@/data/siteDefaults'
import { useSiteStore } from '@/stores/site'
import type { SiteDocument } from '@/types/site'

const site = useSiteStore()
const page = ref<SiteDocument | null>(null)

const phone = computed(() => site.config?.phone ?? DEFAULT_PHONE)

const faqItems = computed(() => {
  const parsed = page.value?.content ? parseFaqFromHtml(page.value.content) : []
  return parsed.length >= 4 ? parsed : defaultFaqItems
})

const intro = computed(() => page.value?.introtext?.trim() || faqIntro)

onMounted(async () => {
  await site.loadConfig()
  try {
    page.value = await fetchPage('chasto-zadavaemy-voprosy')
  } catch {
    page.value = null
  }
})
</script>

<template>
  <section class="faq">
    <PageLayout :title="page?.pagetitle ?? 'Часто задаваемые вопросы'">
      <div class="faq_block faq-page">
        <p class="faq-page__intro">{{ intro }}</p>

        <FaqAccordion :items="faqItems" :initial-open="0" />

        <aside class="faq-page__cta">
          <div class="faq-page__cta-text">
            <strong>Остались вопросы?</strong>
            <span>Позвоните или оставьте заявку — подскажем по меню, доставке и условиям сотрудничества.</span>
          </div>
          <div class="faq-page__cta-actions">
            <a :href="`tel:${phone.replace(/\D/g, '')}`" class="faq-page__cta-phone">{{ phone }}</a>
            <RouterLink to="/#lead" class="faq-page__cta-btn">Оставить заявку</RouterLink>
          </div>
        </aside>
      </div>
    </PageLayout>
  </section>
</template>

<style scoped>
.faq-page {
  max-width: 820px;
  margin: 0 auto;
}

.faq-page__intro {
  margin: 0 0 28px;
  font-size: 17px;
  line-height: 1.65;
  color: #6b6560;
}

.faq-page__cta {
  margin-top: 36px;
  padding: 24px 28px;
  border-radius: 20px;
  background: linear-gradient(135deg, #faf3e9 0%, #f3ebde 100%);
  border: 1px solid rgba(237, 164, 69, 0.2);
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 16px 24px;
}

.faq-page__cta-text {
  display: grid;
  gap: 6px;
  max-width: 420px;
}

.faq-page__cta-text strong {
  font-size: 18px;
  color: #2c2724;
}

.faq-page__cta-text span {
  font-size: 14px;
  line-height: 1.55;
  color: #6b6560;
}

.faq-page__cta-actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px 16px;
}

.faq-page__cta-phone {
  font-size: 18px;
  font-weight: 700;
  color: #517b39;
  text-decoration: none;
}

.faq-page__cta-phone:hover {
  text-decoration: underline;
}

.faq-page__cta-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 44px;
  padding: 0 22px;
  border-radius: 999px;
  background: #517b39;
  color: #fff;
  font-size: 15px;
  font-weight: 600;
  text-decoration: none;
  transition: background 0.15s ease;
}

.faq-page__cta-btn:hover {
  background: #3f5f2d;
}

@media (max-width: 575px) {
  .faq-page__cta {
    padding: 20px;
  }

  .faq-page__cta-actions {
    width: 100%;
    flex-direction: column;
    align-items: stretch;
  }

  .faq-page__cta-btn {
    width: 100%;
  }
}
</style>
