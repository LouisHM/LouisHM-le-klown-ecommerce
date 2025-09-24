<template>
  <div>
    <!-- Not logged in -->
    <button
      v-if="!user"
      @click="showAuth = true"
      class="ml-4 bg-light text-dark px-3 py-1 rounded-full hover:bg-primary hover:text-light transition shadow-lg"
    >
      {{ $t('auth.login') }}
    </button>

    <!-- Logged in -->
    <button
      v-else
      @click="showLogout = true"
      class="ml-4 text-light px-3 py-2 rounded-full hover:bg-light hover:text-dark transition flex items-center gap-2 group"
    >
      {{ user.user_metadata?.full_name || user.email }}
      <svg xmlns="http://www.w3.org/2000/svg"
           class="w-4 h-4 transition-colors group-hover:text-dark"
           fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round"
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v1" />
      </svg>
    </button>

    <!-- Logout popup -->
    <Teleport to="body">
      <div
        v-if="showLogout"
        class="fixed inset-0 z-[9999] bg-black/60 flex items-center justify-center"
        @click.self="showLogout = false"
        @keydown.esc.stop.prevent="showLogout = false"
        tabindex="-1"
      >
        <div
          class="bg-backgroundDark text-light p-6 rounded-2xl shadow-2xl w-full max-w-md mx-4 space-y-6 border border-light/10"
        >
          <p class="text-xl font-heading text-center">{{ $t('auth.logoutTitle') }}</p>
          <div class="flex justify-end gap-3">
            <button
              @click="showLogout = false"
              class="px-4 py-2 rounded bg-light text-dark hover:bg-secondaryLight transition"
            >
              {{ $t('auth.cancel') }}
            </button>
            <button
              @click="handleSignOut"
              class="px-4 py-2 rounded bg-primary text-light hover:bg-light hover:text-dark transition"
            >
              {{ $t('auth.logout') }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Auth modal (email + Google) -->
    <AuthModal :visible="showAuth" defaultMode="signup" @close="showAuth = false" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import AuthModal from '@/components/AuthModal.vue'
import { supabase } from '@/supabase/client'
import { user, role, fetchUserRole, signOut as signOutUser } from '@/composables/useAuth'

const emit = defineEmits<{ (e: 'auth-changed'): void }>()
const router = useRouter()
const route = useRoute()

const showAuth = ref(false)
const showLogout = ref(false)

watch(showLogout, async (open) => {
  console.debug('[AuthButton] showLogout ->', open)
  const html = document.documentElement
  open ? html.classList.add('overflow-hidden') : html.classList.remove('overflow-hidden')
  if (open) {
    await nextTick()
    const el = document.querySelector('[tabindex="-1"]')
    if (el instanceof HTMLElement) el.focus()
  }
})


let unsub: (() => void) | null = null

onMounted(async () => {
  const { data: { user: u } } = await supabase.auth.getUser()
  user.value = u ?? null
  if (user.value) await fetchUserRole()

  const { data: sub } = supabase.auth.onAuthStateChange(async (_event, session) => {
    user.value = session?.user ?? null
    await fetchUserRole()
    emit('auth-changed')
  })
  unsub = () => sub.subscription.unsubscribe()
})

onUnmounted(() => { unsub?.() })

async function handleSignOut() {
  await signOutUser({ hardReloadFallback: true }) // <-- important
  showLogout.value = false
  emit('auth-changed')
  await fetchUserRole()

  if (route.path.startsWith('/admin') && role.value !== 'admin') {
    router.replace('/403')
  }
}
</script>
