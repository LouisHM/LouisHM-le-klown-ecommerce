<template>
  <div class="min-h-[50vh] flex items-center justify-center text-light">
    <div class="text-center">
      <p class="text-lg font-heading mb-2">{{ $t?.('auth.signingIn') || 'Signing you in…' }}</p>
      <p class="text-light/60 text-sm">{{ $t?.('auth.wait') || 'Please wait.' }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { supabase } from '@/supabase/client'
import { refreshSession } from '@/composables/useAuth'

const router = useRouter()
const route = useRoute()

function hasQueryParam(url: string, key: string) {
  try {
    const u = new URL(url)
    return u.searchParams.has(key)
  } catch {
    return false
  }
}

function hasHashParam(url: string, key: string) {
  try {
    const u = new URL(url)
    const hash = new URLSearchParams(u.hash.replace(/^#/, ''))
    return hash.has(key)
  } catch {
    return false
  }
}

function clearUrl() {
  try {
    const u = new URL(window.location.href)
    u.searchParams.delete('code')
    u.searchParams.delete('state')
    u.hash = ''
    window.history.replaceState({}, document.title, `${u.pathname}${u.search}`)
  } catch {
    /* ignore */
  }
}

onMounted(async () => {
  const href = window.location.href

  try {
    if (hasQueryParam(href, 'code')) {
      const { error } = await supabase.auth.exchangeCodeForSession(href)
      if (error) throw error
    } else if (hasHashParam(href, 'access_token')) {
      const { error } = await supabase.auth.getSession()
      if (error) throw error
    }

    await refreshSession()
  } catch (err) {
    console.error('[AuthCallback]', err)
  } finally {
    clearUrl()
    const next = typeof route.query.next === 'string' ? route.query.next : '/'
    router.replace(next || '/')
  }
})
</script>
