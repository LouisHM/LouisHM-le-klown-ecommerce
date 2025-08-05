<template>
  <div>
    <!-- Non connecté -->
    <button 
      v-if="!user"
      @click="signInWithGoogle"
      class="ml-4 bg-light text-dark px-2 py-1 rounded-full hover:bg-primary hover:text-light transition shadow-lg">
      {{ $t('auth.login') }}
    </button>

    <!-- Bouton connecté -->
    <button 
      v-else
      @click="showLogout = true"
      class="ml-4 text-light px-2 py-2 rounded-full hover:bg-light hover:text-dark transition flex items-center gap-2 group"
    >
      {{ user.user_metadata.full_name || user.email }}

      <svg xmlns="http://www.w3.org/2000/svg"
          class="w-4 h-4 transition-colors group-hover:text-dark"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v1" />
      </svg>
    </button>



    <!-- Pop-up logout -->
    <div v-if="showLogout" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div class="bg-backgroundDark text-light p-6 rounded-lg shadow-lg space-y-4">
        <p class="text-xl font-bold">{{ $t('auth.logoutTitle') }}</p>
        <div class="flex justify-end space-x-4">
          <button @click="showLogout = false" class="px-2 py-1 text-dark rounded bg-gray-300 hover:bg-gray-400">
            {{ $t('auth.cancel') }}
          </button>
          <button @click="handleSignOut" class="px-2 py-1 rounded bg-primary text-light hover:bg-dark">
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
import { useRouter, useRoute } from 'vue-router'
import { role, fetchUserRole, signOut } from '../composables/useAuth'

const emit = defineEmits(['auth-changed'])
const router = useRouter()
const route = useRoute()

async function handleSignOut() {
  await signOut()
  emit('auth-changed') // Pour update navbar si besoin
  await fetchUserRole()

  // Si on est sur /admin mais qu'on n'est plus admin → redirection immédiate
  if (route.path.startsWith('/admin') && role.value !== 'admin') {
    router.replace('/403') // ou '/'
  }
}

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
