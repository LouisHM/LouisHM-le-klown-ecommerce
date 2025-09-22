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
import { useRouter } from 'vue-router'
import { supabase } from '@/supabase/client'

const router = useRouter()

onMounted(async () => {
  try {
    // Creates a session when redirected back from Supabase/Google
    const { error } = await supabase.auth.exchangeCodeForSession(window.location.href)
    if (error) {
      console.error('exchangeCodeForSession', error.message)
    }
  } catch (e) {
    console.error(e)
  } finally {
    // Redirect where you want users to land after login
    router.replace('/shop')
  }
})
</script>
