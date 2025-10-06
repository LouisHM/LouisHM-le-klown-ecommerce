<template>
  <div>
    <!-- Non connecté -->
    <button
      v-if="!user"
      @click="showAuth = true"
      class="ml-4 bg-light text-dark px-3 py-1 rounded-full hover:bg-primary hover:text-light transition shadow-lg"
    >
      {{ $t('auth.login') }}
    </button>

    <!-- Connecté -->
    <button
      v-else
      @click="showLogout = true"
      class="ml-4 text-light px-3 py-2 rounded-full hover:bg-light hover:text-dark transition flex items-center gap-2 group"
    >
      {{ user.user_metadata?.full_name || user.email }}
      <i class="fa-solid fa-right-from-bracket"></i>
    </button>

    <!-- Popup logout -->
    <Teleport to="body">
      <div
        v-if="showLogout"
        class="fixed inset-0 z-[9999] bg-black/60 flex items-center justify-center"
        @click.self="showLogout = false"
        @keydown.esc.stop.prevent="showLogout = false"
        tabindex="-1"
      >
        <div class="bg-backgroundDark text-light p-6 rounded-2xl shadow-2xl w-full max-w-md mx-4 space-y-6 border border-light/10">
          <p class="text-xl font-heading text-center">{{ $t('auth.logoutTitle') }}</p>
          <div class="flex justify-center gap-3">
            <button @click="showLogout = false" class="px-4 py-2 rounded bg-light text-dark hover:bg-darkBackground transition">
              {{ $t('auth.cancel') }}
            </button>
            <button @click="handleSignOut" class="px-4 py-2 rounded bg-primary text-light hover:bg-light hover:text-dark transition">
              {{ $t('auth.logout') }}
            </button>
          </div>
          <p v-if="authError" class="text-error text-sm text-center">{{ authError }}</p>
        </div>
      </div>
    </Teleport>

    <!-- Modal d’auth (email + Google) -->
    <AuthModal :visible="showAuth" defaultMode="signup" @close="showAuth = false" />
  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import AuthModal from '@/components/AuthModal.vue'
import { user, signOut, authError, clearAuthError, authLoading } from '@/composables/useAuth'

const emit = defineEmits<{ (e: 'auth-changed'): void }>()

const showAuth = ref(false)
const showLogout = ref(false)
const router = useRouter()

watch(showLogout, async (open) => {
  const html = document.documentElement
  open ? html.classList.add('overflow-hidden') : html.classList.remove('overflow-hidden')
  if (open) {
    await nextTick()
    const el = document.querySelector('[tabindex="-1"]')
    if (el instanceof HTMLElement) el.focus()
  }
})
watch(showAuth, (open) => {
  if (open) clearAuthError()
})

async function handleSignOut() {
  if (authLoading.value) return
  try {
    await signOut()
    showLogout.value = false
    emit('auth-changed')
    await router.replace('/')
  } catch (err) {
    console.error('[AuthButton] signOut failed:', err)
  }
}


onUnmounted(() => {
  document.documentElement.classList.remove('overflow-hidden')
})
</script>
