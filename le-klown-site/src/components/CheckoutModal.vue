<template>
  <Teleport to="body">
    <transition name="fade">
      <div
        v-if="visible"
        class="fixed inset-0 z-[10050] bg-black/70 flex items-end md:items-center justify-center p-0 md:p-6"
        role="dialog"
        aria-modal="true"
        :aria-label="t('checkout.title')"
        @click="onClose"
        @keydown.esc.prevent="onClose"
      >
        <div
          class="w-full h-[100dvh] md:h-auto md:max-h-[85vh] md:max-w-2xl bg-dark text-light md:rounded-2xl shadow-xl overflow-y-auto outline-none"
          @click.stop
          tabindex="-1"
          ref="panel"
        >
          <!-- Header -->
          <div class="flex items-center justify-between px-5 py-4 border-b border-light/10">
            <h2 class="text-xl md:text-2xl font-heading uppercase">
              {{ t('checkout.title') }}
            </h2>
            <button @click="onClose" :aria-label="t('common.close')" class="text-2xl hover:text-primary">&times;</button>
          </div>

          <!-- Body -->
          <div class="p-5 md:p-6 space-y-6">
            <!-- Récap Panier -->
            <div class="bg-backgroundDark/60 rounded-xl p-4 border border-light/10">
              <h3 class="font-semibold mb-3">{{ t('checkout.cartTitle') }}</h3>
              <ul class="space-y-2 text-sm">
                <li v-for="(it, i) in cartItems" :key="i" class="flex justify-between gap-2">
                  <span class="truncate">
                    {{ it.name }}
                    <template v-if="it.size"> — {{ it.size }}</template>
                    × {{ it.quantity }}
                  </span>
                  <span class="whitespace-nowrap">{{ formatPrice(lineTotal(it)) }} €</span>
                </li>
              </ul>
              <div class="h-px bg-light/10 my-3"></div>
              <div class="flex justify-between text-sm">
                <span>{{ t('checkout.subtotal') }}</span>
                <span>{{ formatPrice(subtotal) }} €</span>
              </div>
              <div class="flex justify-between text-sm">
                <span>{{ t('checkout.shipping') }}</span>
                <span>{{ formatPrice(shipping) }} €</span>
              </div>
              <div class="flex justify-between font-semibold text-lg mt-1">
                <span>{{ t('checkout.total') }}</span>
                <span>{{ formatPrice(total) }} €</span>
              </div>
              <p class="text-xs opacity-70 mt-2">
                {{ t('checkout.freeShippingNote', { amount: formatPrice(FREE_SHIPPING_THRESHOLD) }) }}
              </p>
            </div>

            <!-- Formulaire Client (obligatoires marqués *) -->
            <form @submit.prevent="submit" class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm mb-1">
                  {{ t('checkout.lastName') }} <span class="text-red-400">*</span>
                </label>
                <input
                  v-model.trim="form.lastName"
                  class="w-full rounded-lg p-2 bg-backgroundDark border border-light/10"
                  :placeholder="t('checkout.lastName_ph')"
                  required
                />
              </div>

              <div>
                <label class="block text-sm mb-1">
                  {{ t('checkout.firstName') }} <span class="text-red-400">*</span>
                </label>
                <input
                  v-model.trim="form.firstName"
                  class="w-full rounded-lg p-2 bg-backgroundDark border border-light/10"
                  :placeholder="t('checkout.firstName_ph')"
                  required
                />
              </div>

              <div class="md:col-span-2">
                <label class="block text-sm mb-1">
                  {{ t('checkout.address') }} <span class="text-red-400">*</span>
                </label>
                <textarea
                  v-model.trim="form.address"
                  rows="3"
                  class="w-full rounded-lg p-2 bg-backgroundDark border border-light/10"
                  :placeholder="t('checkout.address_ph')"
                  required
                />
              </div>

              <div>
                <label class="block text-sm mb-1">
                  {{ t('checkout.email') }} <span class="text-red-400">*</span>
                </label>
                <input
                  v-model.trim="form.email"
                  type="email"
                  class="w-full rounded-lg p-2 bg-backgroundDark border border-light/10"
                  :placeholder="t('checkout.email_ph')"
                  required
                />
              </div>

              <div>
                <label class="block text-sm mb-1">{{ t('checkout.phone') }}</label>
                <input
                  v-model.trim="form.phone"
                  type="tel"
                  class="w-full rounded-lg p-2 bg-backgroundDark border border-light/10"
                  :placeholder="t('checkout.phone_ph')"
                />
              </div>

              <div>
                <label class="block text-sm mb-1">{{ t('checkout.instagram') }}</label>
                <input
                  v-model.trim="form.instagram"
                  class="w-full rounded-lg p-2 bg-backgroundDark border border-light/10"
                  :placeholder="t('checkout.instagram_ph')"
                />
              </div>

              <div class="md:col-span-2">
                <label class="block text-sm mb-1">{{ t('checkout.notes') }}</label>
                <textarea
                  v-model.trim="form.notes"
                  rows="3"
                  class="w-full rounded-lg p-2 bg-backgroundDark border border-light/10"
                  :placeholder="t('checkout.notes_ph')"
                />
              </div>

              <div v-if="error" class="md:col-span-2 text-red-300 text-sm">
                {{ error }}
              </div>

              <div class="md:col-span-2 flex items-center justify-end gap-3">
                <button type="button" class="px-4 py-2 rounded-xl bg-backgroundDark border border-light/10" @click="onClose">
                  {{ t('common.cancel') }}
                </button>
                <button
                  type="submit"
                  :disabled="submitting || !isValid || cartItems.length === 0"
                  class="px-5 py-2 rounded-xl bg-primary text-dark font-semibold disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {{ submitting ? t('checkout.sending') : t('checkout.confirm') }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </transition>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch, onMounted, onBeforeUnmount } from 'vue'
import { useI18n } from 'vue-i18n'
import { toUnitPriceEUR } from '@/utils/price'

const { t } = useI18n()

// ✅ capture props as 'props' (you referenced props.visible/props.cartItems)
const props = defineProps<{
  visible: boolean
  cartItems: Array<{
    price: number | string
    quantity: number
    name: string
    size?: string
  }>
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'success', payload: { orderRef: string }): void
}>()

// Constants
const FREE_SHIPPING_THRESHOLD = 25
const SHIPPING_FEE = 5

// Form state
const form = reactive({
  lastName: '',
  firstName: '',
  address: '',
  email: '',
  phone: '',
  instagram: '',
  notes: ''
})
const submitting = ref(false)
const error = ref<string | null>(null)

// Focus on open + lock scroll
const panel = ref<HTMLElement | null>(null)
watch(() => props.visible, (v) => {
  document.documentElement.style.overflow = v ? 'hidden' : ''
  if (v) requestAnimationFrame(() => panel.value?.focus())
})
onMounted(() => {
  if (props.visible) panel.value?.focus()
})
onBeforeUnmount(() => {
  document.documentElement.style.overflow = ''
})

// Helpers
function priceNum(raw: any) {
  // keep robust even if helper changes or numeric returns string
  try { return Number(toUnitPriceEUR ? toUnitPriceEUR(raw) : Number(raw)) || 0 } catch { return Number(raw) || 0 }
}
function lineTotal(it: { price: any; quantity: number }) {
  return priceNum(it.price) * Math.max(1, Number(it.quantity) || 1)
}
function formatPrice(n: number) { return n.toFixed(2) }

const subtotal = computed(() =>
  props.cartItems.reduce((s, it) => s + lineTotal(it), 0)
)
const shipping = computed(() => (subtotal.value >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE))
const total = computed(() => subtotal.value + shipping.value)

const isValid = computed(() =>
  !!form.lastName &&
  !!form.firstName &&
  !!form.email &&
  !!form.address &&
  /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)
)

// Actions
function onClose() { emit('close') }

function buildOrderRef() {
  const now = new Date()
  return `KLOWN-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}-${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}${String(now.getSeconds()).padStart(2, '0')}`
}

async function submit() {
  error.value = null
  if (!isValid.value) {
    error.value = t('form.error') || 'Merci de remplir les champs obligatoires (*) avec un email valide.'
    return
  }
  if (!props.cartItems.length) {
    error.value = t('cart.empty') || 'Ton panier est vide.'
    return
  }

  const service_id  = import.meta.env.VITE_EMAILJS_SERVICE_ID
  const template_id = import.meta.env.VITE_EMAILJS_TEMPLATE_ID_ORDER
  const user_id     = import.meta.env.VITE_EMAILJS_PUBLIC_KEY
  if (!service_id || !template_id || !user_id) {
    error.value = 'EmailJS is not configured (missing env vars).'
    return
  }

  // — Build unlimited rows HTML —
  const esc = (s: any) => String(s ?? '')
    .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')

  const rows = props.cartItems.map((it) => {
    const qty   = Math.max(1, Number(it.quantity) || 1)
    const price = priceNum(it.price)
    const line  = (qty * price).toFixed(2)
    const label = `${esc(it.name)}${it.size ? ' (' + esc(it.size) + ')' : ''} × ${qty}`
    return `<tr>
      <td style="padding:6px 0; color:#111;">${label}</td>
      <td style="padding:6px 0;" align="right">${line} €</td>
    </tr>`
  }).join('')

  const items_html = `<table cellspacing="0" cellpadding="0" width="100%" style="border-collapse:collapse; font-size:14px;">${rows}</table>`

  const orderRef = buildOrderRef()

  // IMPORTANT:
  // - In EmailJS template, set "To" = {{to_email}}
  // - Here, send your seller inbox; keep buyer as reply_to

  const template_params = {                  // 👈 must match template To = {{to_email}}
    to_email: form.email,             // buyer email for easy reply

    // meta
    order_ref: orderRef,
    now: new Date().toLocaleString('fr-FR'),

    // totals
    subtotal_eur: subtotal.value.toFixed(2),
    shipping_eur: shipping.value.toFixed(2),
    total_eur: total.value.toFixed(2),
    shipping_policy_text: 'Expédition sous 2–5 jours ouvrés',
    free_shipping_threshold_eur: FREE_SHIPPING_THRESHOLD.toFixed(2),

    // customer
    customer_firstname: form.firstName,
    customer_fullname: `${form.firstName} ${form.lastName}`.trim(),
    customer_email: form.email,
    customer_address: form.address,
    customer_phone: form.phone || '',
    customer_instagram: form.instagram || '',

    // notes
    order_notes: form.notes || '',

    // items table (render with triple braces {{{items_html}}} in the template)
    items_html
  }

  submitting.value = true
  try {
    const res = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ service_id, template_id, user_id, template_params })
    })
    if (!res.ok) throw new Error(`EmailJS error: ${res.status} ${await res.text().catch(()=> '')}`)

    emit('success', { orderRef })
    onClose()
  } catch (e:any) {
    console.error(e)
    error.value = t('form.error') || (e?.message ?? 'Une erreur est survenue. Réessaie.')
  } finally {
    submitting.value = false
  }
}



</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity .2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

/* Tokens projet (adapte si déjà définis globalement) */
.bg-primary { background:#9ecdf1; }
.bg-dark { background:#2b2729; }
.text-light { color:#dee6ca; }
.bg-backgroundDark { background:#1f1c1d; }
.border-light\/10 { border-color: rgba(222,230,202,0.1); }
.hover\:text-primary:hover { color:#9ecdf1; }
</style>
