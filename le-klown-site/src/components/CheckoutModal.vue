<template>
  <Teleport to="body">
    <transition name="fade">
      <div
        v-if="visible"
        class="fixed inset-0 z-[10050] bg-black/70 flex items-end md:items-center justify-center p-0 md:p-6"
        role="dialog"
        aria-modal="true"
        :aria-label="t('checkout.title')"
        @click="handleClose"
        @keydown.esc.prevent="handleClose"
      >
        <div
          class="w-full h-[100dvh] md:h-auto md:max-h-[85vh] md:max-w-2xl bg-dark text-light md:rounded-2xl shadow-xl overflow-y-auto outline-none"
          @click.stop
          tabindex="-1"
          ref="panel"
        >
          <template v-if="!showingSummary">
            <header class="flex items-center justify-between px-5 py-4 border-b border-light/10">
              <h2 class="text-xl md:text-2xl font-heading uppercase">{{ t('checkout.title') }}</h2>
              <button @click="handleClose" :aria-label="t('common.close')" class="text-2xl hover:text-primary">&times;</button>
            </header>

            <div class="p-5 md:p-6 space-y-6">
              <div class="bg-primary/10 border border-primary/40 text-primary rounded-xl p-4 text-sm flex flex-col gap-2">
                <p class="font-semibold">{{ paymentStrings.title }}</p>
                <p class="opacity-90 text-light/90">{{ paymentStrings.instructions }}</p>
                <p class="opacity-70 text-xs text-light/70">{{ paymentStrings.notice }}</p>
              </div>

              <section class="bg-backgroundDark/60 rounded-xl p-4 border border-light/10">
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
              </section>

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
                  <button type="button" class="px-4 py-2 rounded-xl bg-backgroundDark border border-light/10" @click="handleClose">
                    {{ t('common.cancel') }}
                  </button>
                  <button
                    type="submit"
                    :disabled="submitting || !isValid || cartItems.length === 0"
                    class="px-5 py-2 rounded-xl bg-primary text-light font-semibold disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {{ submitting ? t('checkout.sending') : t('checkout.confirm') }}
                  </button>
                </div>
              </form>
            </div>
          </template>

          <template v-else>
            <header class="px-5 py-4 border-b border-light/10 flex items-center justify-between">
              <h2 class="text-xl md:text-2xl font-heading uppercase">{{ summaryStrings.title }}</h2>
            </header>

            <div class="p-5 md:p-6 space-y-4">
              <p>{{ summaryStrings.confirmation(summaryData.orderRef) }}</p>
              <ul class="space-y-2 text-sm bg-backgroundDark/60 border border-light/10 rounded-xl p-4">
                <li v-for="item in summaryData.items" :key="item.label" class="flex justify-between gap-2">
                  <span class="truncate">{{ item.label }}</span>
                  <span>{{ formatPrice(item.total) }} €</span>
                </li>
                <li class="flex justify-between font-semibold border-t border-light/10 pt-2">
                  <span>{{ t('checkout.total') }}</span>
                  <span>{{ formatPrice(summaryData.total) }} €</span>
                </li>
              </ul>
              <div class="bg-primary/10 border border-primary/40 text-primary rounded-xl p-4 text-sm flex flex-col gap-2">
                <p class="font-semibold">{{ paymentStrings.title }}</p>
                <p class="text-light/90">{{ summaryStrings.reminder }}</p>
              </div>
              <button class="w-full py-3 rounded-xl bg-primary text-light font-semibold" @click="closeAfterSummary">
                {{ summaryStrings.close }}
              </button>
            </div>
          </template>
        </div>
      </div>
    </transition>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch, onMounted, onBeforeUnmount } from 'vue'
import { useI18n } from 'vue-i18n'
import { toUnitPriceEUR } from '@/utils/price'
import { user as authUser, firstName as authFirstName, lastName as authLastName } from '@/composables/useAuth'
import { useCart } from '@/composables/useCart'
import { supabase } from '@/supabase/client'

const { t, locale } = useI18n()

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

const showingSummary = ref(false)
const cartStore = useCart()

const FREE_SHIPPING_THRESHOLD = 25
const SHIPPING_FEE = 5

const paymentStrings = computed(() => locale.value === 'fr'
  ? {
      title: 'Comment régler ?',
      instructions: 'En attendant le paiement en ligne, envoie le montant de ta commande par PayPal à klownlife.music@gmail.com en précisant la référence.',
      notice: 'Important : sans confirmation de paiement sous 48 h, la commande sera automatiquement annulée.',
    }
  : {
      title: 'How to pay?',
      instructions: 'Until online payments are live, please send your order total by PayPal to klownlife.music@gmail.com and add your order reference in the message.',
      notice: 'Important: if no payment is confirmed within 48 hours, the order will be automatically cancelled.',
    }
)

const summaryStrings = computed(() => locale.value === 'fr'
  ? {
      title: 'Résumé de commande',
      close: 'Fermer',
      reminder: "Envoie le total par PayPal à klownlife.music@gmail.com en reprenant cette référence. Sans paiement marqué 'Payée' sous 48 h, la commande sera annulée automatiquement.",
      confirmation: (ref: string) => `Merci ! Ta référence commande est ${ref}.`,
    }
  : {
      title: 'Order summary',
      close: 'Close',
      reminder: 'Please send the total by PayPal to klownlife.music@gmail.com using this reference. Orders not marked as Paid within 48 hours are automatically cancelled.',
      confirmation: (ref: string) => `Thanks! Your order reference is ${ref}.`,
    }
)

const form = reactive({
  lastName: '',
  firstName: '',
  address: '',
  email: '',
  phone: '',
  instagram: '',
  notes: ''
})

const summaryData = reactive({
  orderRef: '',
  items: [] as { label: string; total: number }[],
  total: 0,
})

const submitting = ref(false)
const error = ref<string | null>(null)

const panel = ref<HTMLElement | null>(null)
watch(() => props.visible, (v) => {
  document.documentElement.style.overflow = v ? 'hidden' : ''
  if (v) {
    prefillFromUser()
    requestAnimationFrame(() => panel.value?.focus())
  } else {
    resetSummary()
  }
})
onMounted(() => {
  if (props.visible) {
    prefillFromUser()
    panel.value?.focus()
  }
})
onBeforeUnmount(() => {
  document.documentElement.style.overflow = ''
})

function resetSummary() {
  showingSummary.value = false
  summaryData.orderRef = ''
  summaryData.items = []
  summaryData.total = 0
}

function priceNum(raw: any) {
  try { return Number(toUnitPriceEUR ? toUnitPriceEUR(raw) : Number(raw)) || 0 } catch { return Number(raw) || 0 }
}
function lineTotal(it: { price: any; quantity: number }) {
  return priceNum(it.price) * Math.max(1, Number(it.quantity) || 1)
}
function formatPrice(n: number) { return n.toFixed(2) }

const subtotal = computed(() => props.cartItems.reduce((s, it) => s + lineTotal(it), 0))
const shipping = computed(() => (subtotal.value >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE))
const total = computed(() => subtotal.value + shipping.value)

const isValid = computed(() =>
  !!form.lastName &&
  !!form.firstName &&
  !!form.email &&
  !!form.address &&
  /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)
)

function tryFill(target: 'firstName' | 'lastName' | 'email', value?: string | null) {
  if (!value || typeof value !== 'string') return
  if (form[target]) return
  form[target] = value.trim()
}

function prefillFromUser() {
  const current = authUser.value
  if (!current) return
  tryFill('email', current.email)
  tryFill('firstName', authFirstName.value)
  tryFill('lastName', authLastName.value)
  const meta = (current.user_metadata ?? {}) as Record<string, any>
  tryFill('firstName', meta.first_name || meta.given_name)
  tryFill('lastName', meta.last_name || meta.family_name)
  if (!form.firstName || !form.lastName) {
    const full = typeof meta.full_name === 'string' ? meta.full_name : typeof meta.name === 'string' ? meta.name : ''
    if (full) {
      const parts = full.trim().split(/\s+/)
      tryFill('firstName', parts[0])
      tryFill('lastName', parts.slice(1).join(' '))
    }
  }
}

// additional reactivity on user info
watch(authUser, (next, prev) => { if (props.visible && next?.id !== prev?.id) prefillFromUser() })
watch(authFirstName, (value) => { if (props.visible) tryFill('firstName', value) })
watch(authLastName, (value) => { if (props.visible) tryFill('lastName', value) })

function handleClose() {
  resetSummary()
  emit('close')
}

function closeAfterSummary() {
  resetSummary()
  emit('close')
}

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

  const service_id = import.meta.env.VITE_EMAILJS_SERVICE_ID
  const template_id = import.meta.env.VITE_EMAILJS_TEMPLATE_ID_ORDER
  const user_id = import.meta.env.VITE_EMAILJS_PUBLIC_KEY
  if (!service_id || !template_id || !user_id) {
    error.value = 'EmailJS is not configured (missing env vars).'
    return
  }

  const esc = (s: any) => String(s ?? '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
  const rows = props.cartItems.map((it) => {
    const qty = Math.max(1, Number(it.quantity) || 1)
    const price = priceNum(it.price)
    const line = (qty * price).toFixed(2)
    const label = `${esc(it.name)}${it.size ? ' (' + esc(it.size) + ')' : ''} × ${qty}`
    return `<tr><td style="padding:6px 0; color:#111;">${label}</td><td style="padding:6px 0;" align="right">${line} €</td></tr>`
  }).join('')
  const items_html = `<table cellspacing="0" cellpadding="0" width="100%" style="border-collapse:collapse; font-size:14px;">${rows}</table>`
  const orderRef = buildOrderRef()

  const itemsSnapshot = props.cartItems.map(it => ({
    productId: (it as any).productId ?? null,
    name: it.name,
    price: Number(it.price) || 0,
    quantity: Number(it.quantity) || 1,
    size: it.size ?? null,
    image: (it as any).image ?? null,
  }))

  const insertPayload = {
    order_ref: orderRef,
    user_id: authUser.value?.id ?? null,
    customer_email: form.email,
    customer_first_name: form.firstName,
    customer_last_name: form.lastName,
    customer_address: form.address,
    customer_phone: form.phone || null,
    customer_instagram: form.instagram || null,
    customer_notes: form.notes || null,
    subtotal_eur: subtotal.value,
    shipping_eur: shipping.value,
    total_eur: total.value,
    items_snapshot: itemsSnapshot,
    status: 'passée',
    status_passed_at: new Date().toISOString(),
    del_flag: false,
  }

  const template_params = {
    to_email: form.email,
    order_ref: orderRef,
    now: new Date().toLocaleString(locale.value === 'fr' ? 'fr-FR' : 'en-GB'),
    subtotal_eur: subtotal.value.toFixed(2),
    shipping_eur: shipping.value.toFixed(2),
    total_eur: total.value.toFixed(2),
    shipping_policy_text: locale.value === 'fr' ? 'Expédition sous 2–5 jours ouvrés' : 'Shipping within 2–5 business days',
    free_shipping_threshold_eur: FREE_SHIPPING_THRESHOLD.toFixed(2),
    customer_firstname: form.firstName,
    customer_fullname: `${form.firstName} ${form.lastName}`.trim(),
    customer_email: form.email,
    customer_address: form.address,
    customer_phone: form.phone || '',
    customer_instagram: form.instagram || '',
    order_notes: form.notes || '',
    items_html,
  }

  submitting.value = true
  try {
    const { error: insertError } = await supabase
      .from('commandes')
      .insert(insertPayload)
      .single()

    if (insertError) throw new Error(insertError.message)

    summaryData.orderRef = orderRef
    summaryData.items = itemsSnapshot.map(item => ({
      label: `${item.name}${item.size ? ` (${item.size})` : ''} × ${item.quantity}`,
      total: (item.price || 0) * item.quantity,
    }))
    summaryData.total = total.value
    cartStore.clearCart()
    showingSummary.value = true
    emit('success', { orderRef })

    submitting.value = false

    try {
      const res = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ service_id, template_id, user_id, template_params })
      })
      if (!res.ok) {
        console.error('[Checkout] EmailJS error', await res.text().catch(() => res.statusText))
      }
    } catch (emailErr) {
      console.error('[Checkout] Unable to send confirmation email:', emailErr)
    }
    return
  } catch (e: any) {
    console.error(e)
    error.value = t('form.error') || (e?.message ?? 'Une erreur est survenue. Réessaie.')
    submitting.value = false
  }
}
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity .2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
