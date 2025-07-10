<template>
  <div class="flex flex-col items-center mt-10">
    <button @click="signInWithGoogle" class="bg-primary text-light px-6 py-3 rounded-full hover:bg-secondary hover:text-dark transition">
      Se connecter avec Google
    </button>
    <p v-if="user" class="mt-4 text-dark">Connecté en tant que : {{ user.email }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { supabase } from '../supabase/client'

const user = ref()

async function signInWithGoogle() {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google'
  })
  if (error) console.error('Erreur OAuth:', error.message)
}

onMounted(async () => {
  const { data: { user: u } } = await supabase.auth.getUser()
  user.value = u
})
</script>
