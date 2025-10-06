<template>
  <Teleport to="body">
    <transition name="fade">
      <div
        v-if="visible"
        class="fixed inset-0 z-[10060] bg-black/70 flex items-stretch md:items-center justify-center p-0 md:p-6"
        @click="close"
      >

        <div
          class="bg-backgroundDark text-light rounded-none md:rounded-2xl shadow-2xl
                w-screen md:w-full h-[100dvh] md:h-auto md:max-h-[85vh] max-w-4xl
                overflow-hidden relative"
          @click.stop
          tabindex="0"
          @keydown.left.prevent="hasMultiple && prev()"
          @keydown.right.prevent="hasMultiple && next()"
        >

          <!-- Close -->
          <button
            @click="close"
            aria-label="Close"
            class="absolute right-3 top-3 md:left-4 ring-1 ring-white/20 hover:ring-white/40 md:top-4 z-10 w-8 h-8 md:w-10 md:h-10 inline-flex items-center justify-center rounded-full bg-dark/70 hover:bg-black/90 text-light"
          >
            &times;
          </button>

          <!-- Content -->
          <div
            class="grid grid-cols-1 md:grid-cols-2 gap-0 md:gap-6 p-3 md:p-6
                  overflow-y-auto h-[calc(100dvh-0.75rem)] md:h-auto md:max-h-none"
          >

            <!-- LEFT: Media -->
            <div class="p-3 md:p-0">
              <div class="relative aspect-[4/3] md:aspect-square rounded-xl overflow-hidden bg-black/10">
                <img
                  :src="currentImage"
                  :alt="product.name"
                  class="absolute inset-0 w-full h-full object-cover"
                />

                <!-- Arrows -->
                <button
                  v-if="hasMultiple"
                  @click.stop="prev"
                  class="absolute left-3 top-1/2 -translate-y-1/2 inline-flex items-center justify-center
                         w-9 h-9 md:w-10 md:h-10 rounded-full bg-black/50 backdrop-blur-sm text-light
                         ring-1 ring-white/20 hover:ring-white/40 transition"
                  aria-label="Image précédente"
                >
                  <i class="fa-solid fa-chevron-left"></i>
                </button>
                <button
                  v-if="hasMultiple"
                  @click.stop="next"
                  class="absolute right-3 top-1/2 -translate-y-1/2 inline-flex items-center justify-center
                         w-9 h-9 md:w-10 md:h-10 rounded-full bg-black/50 backdrop-blur-sm text-light
                         ring-1 ring-white/20 hover:ring-white/40 transition"
                  aria-label="Image suivante"
                >
                    <i class="fa-solid fa-chevron-right"></i>
                </button>

                <!-- Index -->
                <div
                  v-if="hasMultiple"
                  class="absolute bottom-3 right-3 text-xs bg-black/50 px-2 py-1 rounded-full"
                  aria-live="polite"
                >
                  {{ index + 1 }} / {{ images.length }}
                </div>
              </div>

              <!-- Thumbnails -->
              <div
                v-if="images.length > 1"
                class="mt-3 flex gap-2 overflow-x-auto no-scrollbar"
              >
                <button
                  v-for="(img, i) in images"
                  :key="i"
                  @click="select(i)"
                  class="relative flex-shrink-0 w-12 h-12 md:w-16 md:h-16 rounded-lg m-1 overflow-hidden ring-2 transition"
                  :class="i === index ? 'ring-primary' : 'ring-white/10 hover:ring-white/30'"
                  aria-label="Choisir l'image"
                >
                  <img :src="img" :alt="`${product.name} miniature ${i+1}`" class="w-full h-full object-cover" />
                </button>
              </div>
            </div>

            <!-- RIGHT: Details -->
            <div class="p-3 md:p-0 pr-3 md:pr-0">
              <div class="flex items-start justify-between gap-3">
                <h2 class="text-xl md:text-3xl font-heading leading-tight">{{ product.name }}</h2>

                <!-- Stock pill -->
                <span
                  :class="['inline-block px-2 py-1 text-[11px] md:text-xs font-semibold rounded whitespace-nowrap', stockClass]"
                >
                  {{ $t(`shop.stock.${stockStatus}`) }}
                </span>
              </div>

              <div class="mt-2 text-red-400 font-bold text-lg md:text-2xl">
                {{ product.price.toFixed(2) }} €
              </div>

              <p class="mt-3 text-sm md:text-base text-gray-300 leading-relaxed max-h-40 md:max-h-56 overflow-auto pr-1">
                {{ product.description }}
              </p>

              <!-- Controls: Size + Quantity on the same row -->
              <div class="mt-4 space-y-3">
                <div class="flex gap-3 items-end">
                  <!-- Size -->
                  <div v-if="product.has_sizes" class="flex-1">
                    <label class="font-semibold mb-1 block text-xs md:text-sm">{{ $t('cart.chooseSize') }}</label>
                    <select
                      v-model="selectedSize"
                      ref="sizeSelectEl"
                      class="w-full h-[42px] md:h-[44px] px-3 rounded-lg border bg-dark text-light
                             focus:outline-none"
                      :class="sizeError ? 'border-error ring-1 ring-error' : 'border-gray-600 focus:border-gray-400'"
                      :aria-invalid="sizeError ? 'true' : 'false'"
                      :aria-describedby="sizeError ? sizeErrorId : undefined"
                    >
                      <option disabled value="">{{ $t('cart.chooseSize') }}</option>
                      <option v-for="sz in product.sizes" :key="sz" :value="sz">{{ sz }}</option>
                    </select>
                    <p
                      v-if="sizeError"
                      :id="sizeErrorId"
                      class="mt-1 text-sm text-error"
                      role="alert"
                    >
                      {{ $t('cart.mustChooseSize') }}
                    </p>
                  </div>

                  <!-- Quantity -->
                  <div :class="product.has_sizes ? 'w-28' : 'flex-1'">
                    <label class="font-semibold mb-1 block text-xs md:text-sm">{{ $t('cart.quantity') }}</label>
                    <input
                      type="number"
                      v-model.number="quantity"
                      min="1"
                      :max="product.stock"
                      class="w-full h-[42px] md:h-[44px] px-3 rounded-lg border bg-dark text-light border-gray-600
                             focus:outline-none focus:border-gray-400"
                    />
                  </div>
                </div>

                <!-- CTA -->
                <button
                  @click="addToCart"
                  :disabled="product.stock === 0"
                  class="w-full bg-primary text-light md:text-light py-2.5 md:py-3 rounded-lg font-semibold
                         hover:bg-light hover:text-dark transition
                         disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {{ $t('cart.addToCart') }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useCart } from '@/composables/useCart'

interface Product {
  id: string
  name: string
  description: string
  price: number
  sizes: string[]
  stock: number
  has_sizes: boolean
  images: string[]
}

const props = defineProps<{ visible: boolean; product: Product }>()
const emit = defineEmits(['close'])
const { addItem } = useCart()

const selectedSize = ref<string>('')
const quantity = ref<number>(1)
const sizeError = ref(false)
const sizeSelectEl = ref<HTMLSelectElement | null>(null)

const sizeErrorId = `size-error-${props.product?.id ?? 'p'}`

// Images
const index = ref(0)
const images = computed(() =>
  props.product?.images?.length ? props.product.images : ['/assets/img/default-product.jpg']
)
const hasMultiple = computed(() => images.value.length > 1)
const currentImage = computed(() => images.value[index.value] || images.value[0])

function select(i: number) { index.value = i }
function prev() { index.value = (index.value - 1 + images.value.length) % images.value.length }
function next() { index.value = (index.value + 1) % images.value.length }

// Stock pill
const stockStatus = computed<'inStock' | 'lowStock' | 'outOfStock'>(() => {
  if (props.product.stock === 0) return 'outOfStock'
  if (props.product.stock < 10) return 'lowStock'
  return 'inStock'
})
const stockClass = computed(() => {
  switch (stockStatus.value) {
    case 'inStock':   return 'bg-success text-dark'
    case 'lowStock':  return 'bg-warning text-dark'
    case 'outOfStock':return 'bg-error text-light'
  }
})

function close() { emit('close') }

// Reset à l’ouverture
watch(() => props.visible, (v) => {
  if (v) {
    selectedSize.value = ''
    quantity.value = 1
    sizeError.value = false
    index.value = 0
  }
})

watch(selectedSize, (val) => {
  if (val) sizeError.value = false
})

function addToCart() {
  // Taille requise si nécessaire
  if (props.product.has_sizes && !selectedSize.value) {
    sizeError.value = true
    sizeSelectEl.value?.focus()
    return
  }

  // Clamp quantité (évite NaN/0/négatif)
  const max = Number.isFinite(props.product.stock) ? Math.max(props.product.stock, 0) : 9999
  const q = Math.max(1, Math.min(Number(quantity.value) || 1, max))
  quantity.value = q

  // ✅ Payload identique à ta version qui fonctionnait
  addItem({
    productId: props.product.id,
    name: props.product.name,
    price: props.product.price,
    size: selectedSize.value || undefined,
    quantity: q,
    image: props.product.images?.[0] || undefined,
  })
  console.log('Added to cart:', {
    productId: props.product.id,
    name: props.product.name,
    price: props.product.price,
    size: selectedSize.value || undefined,
    quantity: q,
    image: props.product.images?.[0] || undefined,
  })
  close()
}

watch(() => props.visible, (v) => {
  const html = document.documentElement
  if (v) {
    // lock
    const scrollBarComp = window.innerWidth - html.clientWidth
    html.style.overflow = 'hidden'
    if (scrollBarComp > 0) html.style.paddingRight = scrollBarComp + 'px'
  } else {
    // unlock
    html.style.overflow = ''
    html.style.paddingRight = ''
  }
})

</script>


<style scoped>
.fade-enter-active,
.fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from,
.fade-leave-to { opacity: 0; }

/* Optionnel: masquer la scrollbar des miniatures (WebKit) */
.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }


</style>
