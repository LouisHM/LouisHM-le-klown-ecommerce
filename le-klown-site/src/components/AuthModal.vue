<template>
  <Teleport to="body">
    <Transition
      enter-active-class="duration-200 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="duration-150 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="visible"
        class="fixed inset-0 z-[9999] bg-black/70 flex items-center justify-center px-4 md:px-6"
        role="dialog" aria-modal="true" :aria-label="t('auth.modalTitle')"
        @click="$emit('close')"
      >
        <div
          class="relative w-full max-w-md rounded-2xl bg-backgroundDark text-light border border-light/10 shadow-2xl outline-none ring-1 ring-black/5"
          @click.stop
          tabindex="-1"
          ref="panel"
        >
          <!-- Close -->
          <button
            @click="$emit('close')"
            class="absolute top-0 right-0 z-30 inline-flex items-center justify-center h-9 w-9 text-light hover:text-primary transition"
            :aria-label="t('common.close')"
          >
            <span aria-hidden="true" class="text-xl leading-none">&times;</span>
          </button>

          <div class="relative z-10 p-6 space-y-5">
            <!-- Tabs -->
            <div class="flex gap-2 bg-dark/60 p-1 rounded-xl border border-light/10">
              <button
                class="flex-1 py-2 rounded-lg text-sm"
                :class="mode==='signin' ? 'bg-primary text-light font-semibold' : 'text-light/80'"
                @click="mode='signin'"
              >{{ t('auth.signIn') }}</button>
              <button
                class="flex-1 py-2 rounded-lg text-sm"
                :class="mode==='signup' ? 'bg-primary text-light font-semibold' : 'text-light/80'"
                @click="mode='signup'"
              >{{ t('auth.signUp') }}</button>
            </div>

            <!-- Email form -->
            <form class="space-y-3" @submit.prevent="submit">
              <div class="space-y-1">
                <label class="text-xs uppercase tracking-wide text-light/60">{{ t('auth.email') }}</label>
                <input v-model.trim="email" type="email" required class="form-input" placeholder="name@email.com" />
              </div>

              <div class="space-y-1">
                <label class="text-xs uppercase tracking-wide text-light/60">{{ t('auth.password') }}</label>
                <input v-model.trim="password" type="password" required class="form-input" placeholder="********" />
              </div>

              <div v-if="mode==='signup'" class="space-y-1">
                <label class="text-xs uppercase tracking-wide text-light/60">{{ t('auth.passwordConfirm') }}</label>
                <input v-model.trim="confirm" type="password" required class="form-input" placeholder="********" />
                <p v-if="password && confirm && password!==confirm" class="text-xs text-error">
                  {{ t('auth.passwordMismatch') || 'Passwords do not match' }}
                </p>
              </div>

              <button
                type="submit"
                :disabled="authLoading || (mode==='signup' && password!==confirm)"
                class="w-full py-3 rounded-xl bg-primary text-light font-semibold hover:bg-light hover:text-dark transition disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <span v-if="mode==='signin'">{{ t('auth.signIn') }}</span>
                <span v-else>{{ t('auth.createAccount') || t('auth.signUp') }}</span>
              </button>
            </form>

            <div class="flex items-center gap-3">
              <div class="h-px bg-light/10 flex-1"></div>
              <span class="text-xs text-light/60">{{ t('auth.or') }}</span>
              <div class="h-px bg-light/10 flex-1"></div>
            </div>

            <!-- Google -->
            <button
              @click="google"
              :disabled="authLoading"
              class="w-full py-3 rounded-xl bg-light text-dark font-semibold hover:bg-secondaryLight transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <i class="fa-brands fa-google mr-2"></i>
              {{ t('auth.continueWithGoogle') }}
            </button>

            <p v-if="authError" class="text-error text-sm text-center mt-1">❌ {{ authError }}</p>
            <p v-if="success" class="text-success text-sm text-center mt-1">✅ {{ success }}</p>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import {
  authLoading,
  authError,
  signInWithEmail,
  signUpWithEmail,
  signInWithGoogle,
  clearAuthError,
} from '@/composables/useAuth'

const { t } = useI18n()
const props = defineProps<{ visible: boolean; defaultMode?: 'signin' | 'signup' }>()
const emit = defineEmits<{ (e: 'close'): void }>()

const mode = ref<'signin' | 'signup'>(props.defaultMode ?? 'signin')
const email = ref('')
const password = ref('')
const confirm = ref('')

const success = ref<string | null>(null)
const panel = ref<HTMLElement | null>(null)

watch(() => props.visible, (v) => {
  if (v) {
    mode.value = props.defaultMode ?? 'signin'
    success.value = null
    clearAuthError()
    setTimeout(() => panel.value?.focus(), 0)
  } else {
    email.value = ''
    password.value = ''
    confirm.value = ''
    success.value = null
    clearAuthError()
  }
})

watch(() => props.defaultMode, (val) => {
  if (!props.visible) {
    mode.value = val ?? 'signin'
  }
})

async function submit() {
  success.value = null
  try {
    if (mode.value === 'signin') {
      await signInWithEmail(email.value, password.value)
      success.value = t('auth.signedIn') || 'Signed in!'
      setTimeout(() => emit('close'), 800)
    } else {
      if (password.value !== confirm.value) return
      await signUpWithEmail(email.value, password.value)
      success.value = t('auth.checkInbox') || 'Check your inbox to confirm your email.'
    }
  } catch {
    /* handled in composable */
  }
}

async function google() {
  try {
    await signInWithGoogle()
    // Supabase will redirect → /auth/callback
  } catch { /* handled */ }
}
</script>
