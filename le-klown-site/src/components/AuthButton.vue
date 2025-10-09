<template>
  <div>
    <!-- Non connecté -->
    <button
      v-if="!user"
      @click="showAuth = true"
      class="ml-4 btn btn-white btn-sm shadow-lg"
    >
      {{ $t('auth.login') }}
    </button>

    <!-- Connecté -->
    <button
      v-else
      @click="showLogout = true"
      class="ml-4 btn btn-outline btn-sm gap-2 group"
    >
      {{ displayName || user.email }}
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
            <button @click="showLogout = false" class="btn btn-white btn-sm">
              {{ $t('auth.cancel') }}
            </button>
            <button @click="handleSignOut" class="btn btn-red btn-sm">
              {{ $t('auth.logout') }}
            </button>
          </div>
          <p v-if="authError" class="text-error text-sm text-center">{{ authError }}</p>
        </div>
      </div>
    </Teleport>

    <!-- Modal d’auth (email + Google) -->
    <AuthModal :visible="showAuth" defaultMode="signin" @close="showAuth = false" />
  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import AuthModal from '@/components/AuthModal.vue'
import { user, signOut, authError, clearAuthError, authLoading, displayName } from '@/composables/useAuth'

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

    if (typeof window !== 'undefined') {
      try {
        const current = new URL(window.location.href)
        current.searchParams.delete('code')
        current.searchParams.delete('state')
        window.history.replaceState({}, document.title, `${current.pathname}${current.search}${current.hash}`)
      } catch (err) {
        console.warn('[AuthButton] unable to sanitise URL after logout', err)
      }

      window.location.href = `${window.location.origin}/`
    } else {
      await router.replace('/')
    }
  } catch (err) {
    console.error('[AuthButton] signOut failed:', err)
  }
}


onUnmounted(() => {
  document.documentElement.classList.remove('overflow-hidden')
})
</script>
