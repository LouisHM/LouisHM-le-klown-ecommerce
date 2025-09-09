<template>
  <form
    @submit.prevent="handleSubmit"
    class="text-light p-4 rounded-2xl shadow-2xl w-full max-w-xl space-y-6"
  >
    <h2 class="text-3xl font-heading text-center text-primary mb-6">
      {{ t('form.title') }}
    </h2>

    <div class="flex flex-col md:flex-row gap-4">
      <div class="flex-1 flex flex-col gap-2">
        <label for="name" class="font-semibold text-left">
          {{ t('form.labels.name') }}
        </label>
        <input
          v-model="form.name"
          type="text"
          id="name"
          name="name"
          required
          class="w-full px-4 py-3 rounded-lg focus:ring-2 text-dark focus:ring-primary focus:outline-none transition text-sm"
          :placeholder="t('form.placeholders.yourName')"
        />
      </div>

      <div class="flex-1 flex flex-col gap-2">
        <label for="email" class="font-semibold text-left">
          {{ t('form.labels.email') }}
        </label>
        <input
          v-model="form.email"
          type="email"
          id="email"
          name="email"
          required
          :placeholder="t('form.placeholders.yourEmail')"
          class="w-full px-4 py-3 rounded-lg focus:ring-2 text-dark focus:ring-primary focus:outline-none transition text-sm"
        />
      </div>
    </div>

    <div class="flex flex-col gap-2">
      <label for="subject" class="font-semibold text-left">
        {{ t('form.labels.subject') }}
      </label>
      <input
        v-model="form.subject"
        type="text"
        id="subject"
        name="subject"
        required
        :placeholder="t('form.placeholders.yourSubject')"
        class="w-full px-4 py-3 rounded-lg focus:ring-2 text-dark focus:ring-primary focus:outline-none transition text-sm"
      />
    </div>

    <div class="flex flex-col gap-2">
      <label for="message" class="font-semibold text-left">
        {{ t('form.labels.message') }}
      </label>
      <textarea
        v-model="form.message"
        id="message"
        name="message"
        required
        rows="5"
        :placeholder="t('form.placeholders.yourMessage')"
        class="w-full px-4 py-3 rounded-lg focus:ring-2 text-dark focus:ring-primary focus:outline-none transition text-sm"
      ></textarea>
    </div>

    <button
      type="submit"
      class="w-full py-3 rounded-lg bg-primary text-white font-semibold text-lg tracking-wide hover:bg-light hover:text-dark transition duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
      :disabled="loading"
    >
      {{ loading ? t('form.loading') : t('form.button') }}
    </button>

    <p v-if="success" class="text-green-600 text-center text-sm mt-2">
      ✅ {{ t('form.success') }}
    </p>
    <p v-if="error" class="text-red-600 text-center text-sm mt-2">
      ❌ {{ t('form.error') }}
    </p>
  </form>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()

const form = ref({ name: '', email: '', subject: '', message: '' })
const loading = ref(false)
const success = ref(false)
const error = ref(false)

async function handleSubmit() {
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
    form.value = { name: '', email: '', subject: '', message: '' }
  } catch (e) {
    console.error(e)
    error.value = true
  } finally {
    loading.value = false
  }
}
</script>
