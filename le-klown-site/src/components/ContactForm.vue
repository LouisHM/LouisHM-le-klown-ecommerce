<template>
  <form
    @submit.prevent="handleSubmit"
    class="relative w-full rounded-2xl overflow-hidden"
    novalidate
  >
    <!-- Card -->
    <div class="relative bg-backgroundDark/90 p-6 md:p-8 text-light space-y-6">
      <!-- Header -->
      <header class="flex items-center gap-3">
        <div class="h-10 w-10 rounded-xl bg-primary/20 flex items-center justify-center">
          <i class="fa-regular fa-envelope text-primary text-lg"></i>
        </div>
        <div>
          <h2 class="text-2xl md:text-3xl font-heading leading-tight">
            {{ t('form.title') }}
          </h2>
        </div>
      </header>

      <!-- Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <!-- Name -->
        <div class="space-y-1">
          <label for="name" class="text-xs uppercase tracking-wide text-light/60">
            {{ t('form.labels.name') }}
          </label>
          <div
            class="group flex items-center gap-2 rounded-xl bg-dark/60 border border-light/10 focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/30 transition"
            :class="{ 'border-error ring-2 ring-error/30': !!errors.name }"
          >
            <i class="fa-regular fa-user ml-3 text-light/50 group-focus-within:text-primary"></i>
            <input
              v-model.trim="form.name"
              type="text"
              id="name"
              name="name"
              required
              :placeholder="t('form.placeholders.yourName')"
              class="form-input bg-transparent border-0 focus:ring-0 px-3 py-3 text-sm placeholder:text-light/30"
              :aria-invalid="!!errors.name"
              aria-describedby="err-name"
            />
          </div>
          <p v-if="errors.name" id="err-name" class="text-xs text-error">{{ errors.name }}</p>
        </div>

        <!-- Email -->
        <div class="space-y-1">
          <label for="email" class="text-xs uppercase tracking-wide text-light/60">
            {{ t('form.labels.email') }}
          </label>
          <div
            class="group flex items-center gap-2 rounded-xl bg-dark/60 border border-light/10 focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/30 transition"
            :class="{ 'border-error ring-2 ring-error/30': !!errors.email }"
          >
            <i class="fa-regular fa-at ml-3 text-light/50 group-focus-within:text-primary"></i>
            <input
              v-model.trim="form.email"
              type="email"
              id="email"
              name="email"
              required
              :placeholder="t('form.placeholders.yourEmail')"
              class="form-input bg-transparent border-0 focus:ring-0 px-3 py-3 text-sm placeholder:text-light/30"
              :aria-invalid="!!errors.email"
              aria-describedby="err-email"
            />
          </div>
          <p v-if="errors.email" id="err-email" class="text-xs text-error">{{ errors.email }}</p>
        </div>

        <!-- Subject -->
        <div class="md:col-span-2 space-y-1">
          <label for="subject" class="text-xs uppercase tracking-wide text-light/60">
            {{ t('form.labels.subject') }}
          </label>
          <div
            class="group flex items-center gap-2 rounded-xl bg-dark/60 border border-light/10 focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/30 transition"
            :class="{ 'border-error ring-2 ring-error/30': !!errors.subject }"
          >
            <i class="fa-regular fa-bookmark ml-3 text-light/50 group-focus-within:text-primary"></i>
            <input
              v-model.trim="form.subject"
              type="text"
              id="subject"
              name="subject"
              required
              :placeholder="t('form.placeholders.yourSubject')"
              class="form-input bg-transparent border-0 focus:ring-0 px-3 py-3 text-sm placeholder:text-light/30"
              :aria-invalid="!!errors.subject"
              aria-describedby="err-subject"
            />
          </div>
          <p v-if="errors.subject" id="err-subject" class="text-xs text-error">{{ errors.subject }}</p>
        </div>

        <!-- Message -->
        <div class="md:col-span-2 space-y-1">
          <label for="message" class="text-xs uppercase tracking-wide text-light/60">
            {{ t('form.labels.message') }}
          </label>
          <div
            class="group rounded-xl overflow-hidden bg-dark/60 border border-light/10 focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/30 transition"
            :class="{ 'border-error ring-2 ring-error/30': !!errors.message }"
          >
            <textarea
              v-model.trim="form.message"
              id="message"
              name="message"
              rows="5"
              required
              :placeholder="t('form.placeholders.yourMessage')"
              class="form-textarea w-min border-0 focus:ring-0 px-4 py-3 text-sm placeholder:text-light/30 resize-y min-h-[140px]"
              @input="updateCount"
              :aria-invalid="!!errors.message"
              aria-describedby="err-message"
            ></textarea>
          </div>
          <div class="flex items-center justify-between">
            <p v-if="errors.message" id="err-message" class="text-xs text-error">{{ errors.message }}</p>
            <p class="ml-auto text-[11px] text-light/40">{{ chars }}/{{ MAX }}</p>
          </div>
        </div>
      </div>

      <!-- Submit -->
      <div class="pt-2">
        <button
          type="submit"
          :disabled="loading"
          class="w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl bg-primary text-light font-semibold tracking-wide hover:bg-light hover:text-dark transition disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <span v-if="!loading">{{ t('form.button') }}</span>
          <span v-else class="inline-flex items-center gap-2">
            <i class="fa-solid fa-spinner fa-spin"></i>
            {{ t('form.loading') }}
          </span>
        </button>
      </div>

      <!-- Alerts -->
      <transition name="fade">
        <p v-if="success" class="text-center text-success text-sm">✅ {{ t('form.success') }}</p>
      </transition>
      <transition name="fade">
        <p v-if="error" class="text-center text-error text-sm">❌ {{ t('form.error') }}</p>
      </transition>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref, watchEffect } from 'vue'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()

defineProps<{ topic?: string }>()
const emit = defineEmits<{ (e: 'submitted'): void }>()

const MAX = 800
const chars = ref(0)

const form = ref({ name: '', email: '', subject: '', message: '' })
const loading = ref(false)
const success = ref(false)
const error = ref(false)
const errors = ref<{ name?: string; email?: string; subject?: string; message?: string }>({})

function validate() {
  errors.value = {}
  if (!form.value.name) errors.value.name = t('form.validation.name') || 'Nom requis.'
  if (!/.+@.+\..+/.test(form.value.email)) errors.value.email = t('form.validation.email') || 'Email invalide.'
  if (!form.value.subject) errors.value.subject = t('form.validation.subject') || 'Sujet requis.'
  if (!form.value.message) errors.value.message = t('form.validation.message') || 'Message requis.'
  return Object.keys(errors.value).length === 0
}

function updateCount() {
  chars.value = form.value.message.length
  if (chars.value > MAX) form.value.message = form.value.message.slice(0, MAX)
}

watchEffect(() => { chars.value = form.value.message.length })

async function handleSubmit() {
  if (!validate()) return
  loading.value = true
  success.value = false
  error.value = false

  try {
    const res = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        service_id: import.meta.env.VITE_EMAILJS_SERVICE_ID,
        template_id: import.meta.env.VITE_EMAILJS_TEMPLATE_ID_CONTACT,
        user_id: import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
        template_params: {
          from_name: form.value.name,
          from_email: form.value.email,
          subject: form.value.subject,
          message: form.value.message,
          email_time: new Date().toLocaleTimeString(),
        },
      }),
    })
    if (!res.ok) throw new Error(await res.text())
    success.value = true
    emit('submitted')
    form.value = { name: '', email: '', subject: '', message: '' }
    chars.value = 0
  } catch (e) {
    console.error(e)
    error.value = true
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity .2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

.form-textarea {
  min-width: -webkit-fill-available;
}

</style>
