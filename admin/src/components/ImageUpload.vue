<script setup lang="ts">
import { ref } from 'vue'
import axios from 'axios'

const props = defineProps<{
  modelValue?: string
  label?: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const busy = ref(false)
const error = ref('')

async function onFile(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  input.value = ''
  if (!file) return

  busy.value = true
  error.value = ''
  try {
    const fd = new FormData()
    fd.append('file', file)
    const { data } = await axios.post<{ ok: boolean; path?: string; error?: string }>(
      '/api/admin/upload',
      fd,
      { withCredentials: true },
    )
    if (!data.ok || !data.path) {
      throw new Error(data.error ?? 'Не удалось загрузить файл')
    }
    emit('update:modelValue', data.path)
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Ошибка загрузки'
  } finally {
    busy.value = false
  }
}

function clear() {
  emit('update:modelValue', '')
}
</script>

<template>
  <div class="image-upload">
    <label v-if="label" class="image-upload__label">{{ label }}</label>
    <input
      type="file"
      accept="image/jpeg,image/png,image/webp"
      class="image-upload__input"
      :disabled="busy"
      @change="onFile"
    />
    <p v-if="busy" class="image-upload__hint">Загрузка…</p>
    <p v-if="error" class="image-upload__error">{{ error }}</p>
    <div v-if="modelValue" class="image-upload__preview">
      <img :src="modelValue" alt="Превью" />
      <button type="button" class="image-upload__clear" @click="clear">Убрать</button>
    </div>
  </div>
</template>

<style scoped>
.image-upload {
  display: grid;
  gap: 8px;
}

.image-upload__label {
  font-size: 14px;
  font-weight: 500;
}

.image-upload__input {
  font-size: 14px;
}

.image-upload__hint {
  margin: 0;
  font-size: 13px;
  color: #6b6560;
}

.image-upload__error {
  margin: 0;
  font-size: 13px;
  color: #b42318;
}

.image-upload__preview {
  display: flex;
  align-items: center;
  gap: 12px;
}

.image-upload__preview img {
  width: 96px;
  height: 96px;
  object-fit: cover;
  border-radius: 12px;
  border: 1px solid #e8e2da;
}

.image-upload__clear {
  border: 0;
  background: none;
  color: #6b6560;
  font-size: 13px;
  text-decoration: underline;
  cursor: pointer;
  padding: 0;
}
</style>
