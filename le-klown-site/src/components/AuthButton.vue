<template>
  <div>
    <!-- Non connecté -->
    <button 
      v-if="!user"
      @click="signInWithGoogle"
      class="ml-4 bg-light text-dark px-2 py-1 rounded-full hover:bg-primary hover:text-light transition shadow-lg">
      {{ $t('auth.login') }}
    </button>

    <!-- Connecté -->
    <button 
      v-else
      @click="showLogout = true"
      class="ml-4 text-light px-2 py-2 rounded-full hover:bg-dark hover:text-dark transition flex items-baseline justify-center gap-2">
      {{ user.user_metadata.full_name || user.email }} 
      <div v-html="logoutSvg" class="w-4 h-4 text-gray-400 hover:text-red-500"></div>

    </button>

    <!-- Pop-up logout -->
    <div v-if="showLogout" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-backgroundDark text-light p-6 rounded-lg shadow-lg space-y-4">
        <p class="text-xl font-bold">{{ $t('auth.logoutTitle') }}</p>
        <div class="flex justify-end space-x-4">
          <button @click="showLogout = false" class="px-2 py-1 text-dark rounded bg-gray-300 hover:bg-gray-400">
            {{ $t('auth.cancel') }}
          </button>
          <button @click="signOut" class="px-2 py-1 rounded bg-primary text-light hover:bg-dark">
            {{ $t('auth.logout') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { supabase } from '../supabase/client'
import logoutSvg from '/assets/svg/logout.svg?raw'

const user = ref<any>(null)
const showLogout = ref(false)

async function signInWithGoogle() {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      queryParams: {
        prompt: 'select_account'
      }
    }
  })
  if (error) console.error('Erreur OAuth:', error.message)
}


async function signOut() {
  await supabase.auth.signOut()
  user.value = null
  showLogout.value = false
}

onMounted(async () => {
  const { data: { user: u } } = await supabase.auth.getUser()
  user.value = u
})
</script>
