import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import http from '@/api/client'

export interface AuthUser {
  id: number
  username: string
  email: string
  fullname: string
  phone: string
  accountType: string
  extended: Record<string, unknown>
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<AuthUser | null>(null)
  const loaded = ref(false)

  const isAuthenticated = computed(() => !!user.value)

  async function loadMe() {
    try {
      const { data } = await http.get<{ ok: boolean; authenticated?: boolean; user?: AuthUser }>(
        '/api/site/account/me',
      )
      user.value = data.authenticated === false ? null : (data.user ?? null)
    } catch {
      user.value = null
    } finally {
      loaded.value = true
    }
  }

  async function login(username: string, password: string) {
    const csrf = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') ?? ''
    const { data } = await http.post('/evocms-user/auth', {
      username,
      password,
      _token: csrf,
    })
    if (data.status !== 'ok') {
      throw new Error('auth_failed')
    }
    await loadMe()
  }

  async function register(fields: Record<string, string>) {
    const csrf = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') ?? ''
    const { data } = await http.post('/evocms-user/register', { ...fields, _token: csrf })
    if (data.status !== 'ok') {
      throw new Error('register_failed')
    }
    await loadMe()
  }

  async function saveProfile(payload: Record<string, unknown>) {
    const { data } = await http.post('/api/site/account/profile', payload)
    user.value = data.user
  }

  async function changePassword(current: string, newPass: string, repeat: string) {
    await http.post('/api/site/account/password', {
      currentPassword: current,
      newPassword: newPass,
      repeatPassword: repeat,
    })
  }

  async function logout() {
    await http.post('/api/auth/logout').catch(() => {})
    user.value = null
    window.location.href = '/'
  }

  return {
    user,
    loaded,
    isAuthenticated,
    loadMe,
    login,
    register,
    saveProfile,
    changePassword,
    logout,
  }
})
