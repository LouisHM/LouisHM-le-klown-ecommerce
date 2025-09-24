<template>
  <!-- FAB Panier (rond) -->
  <Teleport to="body">
    <button
      v-show="!isOpen"
      type="button"
      class="!fixed left-auto right-4 bottom-4 md:right-6 md:bottom-6 z-[100] relative
             w-14 h-14 rounded-full shadow-xl bg-primary backdrop-blur
             inline-flex items-center justify-center
             hover:bg-white hover:text-primary text-light transition pointer-events-auto"
      @click="openCart()"
      :aria-label="t('cart.open', 1) || 'Ouvrir le panier'"
    >
    <i class="fa-solid fa-cart-shopping"></i>

      <!-- Bulle notification -->
      <span
        v-if="count > 0"
        class="absolute -top-1 -right-1 min-w-5 h-5 px-1 rounded-full text-[11px] font-bold
               text-light bg-primary flex items-center justify-center ring-2 ring-dark"
        :aria-label="`${count} ${t('cart.items') || 'articles'}`"
      >
        {{ count }}
      </span>
    </button>
  </Teleport>

  <!-- Overlay -->
  <Teleport to="body">
    <transition name="overlay-fade" appear>
      <div v-show="isOpen" class="fixed inset-0 z-[8000] bg-black/70" @click="close()"></div>
    </transition>

    <!-- Drawer à DROITE -->
    <transition name="slide-right" appear>
      <aside
        v-show="isOpen"
        class="fixed right-0 top-0 h-full w-[92%] max-w-md z-[9000]
               bg-backgroundDark text-light shadow-2xl
               rounded-l-2xl overflow-hidden flex flex-col"
        @click.stop
      >
        <!-- Header -->
        <div class="px-4 py-4 flex items-center justify-between border-b border-white/10">
          <div class="flex items-center gap-3">
            <div class="w-9 h-9 rounded-full bg-primary/20 inline-flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-primary" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M7 4h-2l-1 2h2l3.6 7.59-1.35 2.45A2 2 0 0 0 10 19h9v-2h-9l1.1-2h7.45a2 2 0 0 0 1.8-1.12L22 8H7.42l-.7-1.4L7 4z"/>
              </svg>
            </div>
            <h2 class="text-xl font-heading">{{ t('cart.title') || 'Panier' }}</h2>
          </div>

          <button
            class="w-9 h-9 rounded-full bg-black/40 hover:bg-black/60 inline-flex items-center justify-center"
            @click="close()"
            :aria-label="t('common.close') || 'Fermer le panier'"
          >
            &times;
          </button>
        </div>

        <!-- Items -->
        <div class="flex-1 overflow-y-auto p-4 space-y-3">
          <div v-if="items.length === 0" class="text-sm text-gray-300">
            {{ t('cart.empty') || 'Votre panier est vide.' }}
          </div>

          <div
            v-for="(it, i) in items"
            :key="i"
            class="bg-white/5 rounded-xl p-3 ring-1 ring-white/10 flex gap-3"
          >
            <div class="w-20 h-20 rounded-lg overflow-hidden bg-black/10 flex-shrink-0">
              <img :src="it.image || fallbackImg" :alt="it.name" class="w-full h-full object-cover" />
            </div>

            <div class="flex-1 min-w-0">
              <div class="flex items-start justify-between gap-2">
                <h3 class="font-semibold truncate">{{ it.name }}</h3>
                <button
                  class="text-sm text-red-400 hover:text-red-300"
                  @click="remove(it)"
                >
                  {{ t('cart.remove') || 'Retirer' }}
                </button>
              </div>

              <!-- Badges -->
              <div class="mt-1 flex items-center gap-2">
                <span
                  v-if="it.size"
                  class="inline-block px-2 py-0.5 text-[11px] rounded border border-white/20 bg-black/20"
                >
                  {{ it.size }}
                </span>
                <span
                  v-if="it.stockStatus"
                  :class="['inline-block px-2 py-0.5 text-[11px] font-semibold rounded',
                           it.stockStatus === 'inStock' ? 'bg-success text-dark'
                           : it.stockStatus === 'lowStock' ? 'bg-warning text-dark'
                           : 'bg-error text-light']"
                >
                  {{ stockLabel(it.stockStatus) }}
                </span>
              </div>

              <!-- Qty & price -->
              <div class="mt-2 flex items-center justify-between gap-3">
                <div class="inline-flex items-center gap-2 bg-black/30 rounded-lg p-1">
                  <button class="w-7 h-7 rounded-md bg-black/40" @click="dec(it)" aria-label="Diminuer">−</button>
                  <input
                    type="number"
                    class="w-12 bg-transparent text-center outline-none"
                    :min="1"
                    :max="999"
                    v-model.number="it.quantity"
                    @change="setQty(it, it.quantity)"
                  />
                  <button class="w-7 h-7 rounded-md bg-black/40" @click="inc(it)" aria-label="Augmenter">+</button>
                </div>

                <div class="text-right font-semibold">
                  {{ lineTotal(it).toFixed(2) }} €
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="p-4 border-t border-white/10 bg-white/5">
          <div class="flex items-center justify-between mb-3">
            <span class="text-sm text-gray-300">{{ t('cart.subtotal') || 'Sous-total' }}</span>
            <span class="text-lg font-bold">{{ subtotal.toFixed(2) }} €</span>
          </div>

          <div class="flex gap-3">
            <button
              class="flex-1 bg-light text-dark font-semibold py-2.5 rounded-lg hover:brightness-95 transition"
              @click="emit('checkout', [...items])"
              :disabled="items.length === 0"
            >
              {{ t('cart.checkout') || 'Passer au paiement' }}
            </button>

            <button
              class="px-3 py-2 rounded-lg bg-black/40 hover:bg-black/60 text-sm"
              @click="clearCart()"
              :disabled="items.length === 0"
            >
              {{ t('cart.clear') || 'Vider' }}
            </button>
          </div>
        </div>
      </aside>
    </transition>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, ref, unref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useCart } from '@/composables/useCart'

const { t } = useI18n()

const props = defineProps<{ open: boolean }>()
const emit = defineEmits<{
  (e:'update:open', v:boolean): void
  (e:'checkout', items:any[]): void
}>()

function closeCart() { emit('update:open', false) }

/* État d'ouverture robuste (contrôlé OU interne) */
const internalOpen = ref(false)
const isOpen = computed<boolean>(() => internalOpen.value || !!props.open)
function openCart()  { internalOpen.value = true;  emit('update:open', true) }
watch(() => props.open, (v) => { if (typeof v === 'boolean') internalOpen.value = !!v })

/* Store panier */
const cart = useCart() as any

type CartItem = {
  productId: string
  name: string
  price: number
  quantity: number
  size?: string
  image?: string
  stockStatus?: 'inStock' | 'lowStock' | 'outOfStock'
}

/* Helpers de normalisation -> tableau sûr */
function toArray(maybe: any): CartItem[] {
  const v = unref(maybe)
  if (!v) return []
  if (Array.isArray(v)) return v as CartItem[]
  if (v instanceof Map) return Array.from(v.values()) as CartItem[]
  if (typeof v === 'object') {
    if (Array.isArray((v as any).items)) return (v as any).items as CartItem[]
    const values = Object.values(v)
    if (values.every(x => typeof x === 'object')) return values as CartItem[]
    return []
  }
  if (typeof v === 'string') {
    try { const parsed = JSON.parse(v); return Array.isArray(parsed) ? (parsed as CartItem[]) : [] }
    catch { return [] }
  }
  return []
}
function firstNonEmpty<T>(...lists: T[][]): T[] {
  for (const l of lists) if (l && l.length) return l
  return []
}

/* Sélecteurs */
const items = computed<CartItem[]>(() => {
  const candidates = [
    toArray(cart.items),
    toArray(cart.cartItems),
    toArray(cart.value?.items),
    toArray(cart.value),
  ]
  return firstNonEmpty<CartItem>(...candidates)
})
const count = computed<number>(() =>
  items.value.reduce((n, it) => n + (Number(it.quantity) || 0), 0)
)
const subtotal = computed<number>(() =>
  items.value.reduce((s, it) => s + (Number(it.quantity) || 0) * (Number(it.price) || 0), 0)
)

const fallbackImg = '/assets/img/default-product.jpg'

/* Actions overlay */
function close() { closeCart() } // alias pour @click

/* Actions ligne */
function lineTotal(it: CartItem) {
  return (Number(it.price) || 0) * Math.max(1, Number(it.quantity) || 1)
}
function setQty(it: CartItem, q: number) {
  const newQ = Math.max(1, Math.min(Number(q) || 1, 999))
  if (typeof cart.updateQuantity === 'function') {
    cart.updateQuantity(it.productId, it.size, newQ)
  } else if (typeof cart.updateItem === 'function') {
    cart.updateItem({ ...it, quantity: newQ })
  } else if (Array.isArray(cart.items)) {
    const idx = cart.items.findIndex((x: CartItem) => x.productId === it.productId && x.size === it.size)
    if (idx >= 0) cart.items[idx].quantity = newQ
  } else {
    it.quantity = newQ
  }
}
function inc(it: CartItem) { setQty(it, (Number(it.quantity) || 1) + 1) }
function dec(it: CartItem) { setQty(it, (Number(it.quantity) || 1) - 1) }
function remove(it: CartItem) {
  if (typeof cart.removeItem === 'function') {
    cart.removeItem(it.productId, it.size)
  } else if (typeof cart.remove === 'function') {
    cart.remove(it)
  } else if (Array.isArray(cart.items)) {
    cart.items = cart.items.filter((x: CartItem) =>
      !(x.productId === it.productId && x.size === it.size)
    )
  }
}
function clearCart() {
  if (typeof cart.clear === 'function') cart.clear()
  else if (typeof cart.reset === 'function') cart.reset()
  else if (Array.isArray(cart.items)) cart.items = []
}

/* Libellés */
function stockLabel(s: CartItem['stockStatus']) {
  if (s === 'inStock')  return t('shop.stock.inStock')  || 'En stock'
  if (s === 'lowStock') return t('shop.stock.lowStock') || 'Bientôt épuisé'
  return t('shop.stock.outOfStock') || 'Épuisé'
}

/* Auto-ouverture après ajout (0 -> >0) */
let lastCount = 0
watch(count, (c) => {
  if (lastCount === 0 && c > 0) openCart()
  lastCount = c
})
</script>

<style scoped>
/* Overlay fade */
.overlay-fade-enter-active,
.overlay-fade-leave-active { transition: opacity .25s ease; }
.overlay-fade-enter-from,
.overlay-fade-leave-to { opacity: 0; }

/* Slide depuis la DROITE */
.slide-right-enter-active,
.slide-right-leave-active { transition: transform .32s cubic-bezier(.22,.61,.36,1); }
.slide-right-enter-from,
.slide-right-leave-to { transform: translateX(100%); }
</style>
