<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import PageLayout from '@/components/layout/PageLayout.vue'
import { legalDocuments } from '@/data/legalContent'
import NotFoundView from '@/views/NotFoundView.vue'

const route = useRoute()

const slug = computed(() => route.path.replace(/^\//, ''))
const doc = computed(() => legalDocuments[slug.value])
</script>

<template>
  <NotFoundView v-if="!doc" />
  <PageLayout v-else :title="doc.title">
    <article class="site-card site-card--prose legal-page">
      <p class="legal-page__updated">Редакция от {{ doc.updated }}</p>
      <p v-if="doc.intro" class="legal-page__intro">{{ doc.intro }}</p>

      <section v-for="(section, i) in doc.sections" :key="i" class="legal-page__section">
        <h2 v-if="section.heading">{{ section.heading }}</h2>
        <p v-for="(paragraph, j) in section.paragraphs" :key="j">{{ paragraph }}</p>
      </section>
    </article>
  </PageLayout>
</template>

<style scoped>
.legal-page__updated {
  margin: 0 0 16px;
  font-size: 14px;
  color: var(--site-muted);
}

.legal-page__intro {
  margin: 0 0 24px;
  font-size: 16px;
  line-height: 1.55;
}

.legal-page__section {
  margin-bottom: 24px;
}

.legal-page__section h2 {
  margin: 0 0 12px;
  font-size: 18px;
  font-weight: 600;
}

.legal-page__section p {
  margin: 0 0 10px;
  font-size: 15px;
  line-height: 1.55;
  color: var(--site-text);
}

.legal-page__section p:last-child {
  margin-bottom: 0;
}
</style>
