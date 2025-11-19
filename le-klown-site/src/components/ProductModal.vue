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
        >
          <button
            class="absolute right-3 top-3 md:left-4 md:top-4 z-10 w-10 h-10 inline-flex items-center justify-center rounded-full bg-dark/70 hover:bg-black/90 text-light"
            @click="close"
            aria-label="Fermer"
          >
            &times;
          </button>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-0 md:gap-6 p-3 md:p-6 overflow-y-auto h-[calc(100dvh-0.75rem)] md:h-auto md:max-h-none">
            <!-- Media -->
            <div class="p-3 md:p-0">
              <div class="relative flex items-center justify-center rounded-xl bg-black/10 overflow-hidden h-[60vh] md:h-auto md:aspect-square">
                <CachedImage
                  :src="currentImage"
                  :alt="product.name"
                  class="w-full h-full object-contain"
                  placeholder="/assets/img/default-product.jpg"
                />

                <button v-if="hasMultiple" @click.stop="prev" class="nav-btn left-3" aria-label="Image précédente">
                  <i class="fa-solid fa-chevron-left"></i>
                </button>
                <button v-if="hasMultiple" @click.stop="next" class="nav-btn right-3" aria-label="Image suivante">
                  <i class="fa-solid fa-chevron-right"></i>
                </button>

                <div
                  v-if="hasMultiple"
                  class="absolute bottom-3 right-3 text-xs bg-black/60 px-2 py-1 rounded-full"
                >
                  {{ index + 1 }} / {{ images.length }}
                </div>
              </div>

              <div v-if="images.length > 1" class="mt-3 flex gap-2 overflow-x-auto no-scrollbar">
                <button
                  v-for="(img, i) in images"
                  :key="`thumb-${i}`"
                  class="relative flex-shrink-0 w-14 h-14 md:w-16 md:h-16 rounded-lg overflow-hidden ring-2 transition"
                  :class="i === index ? 'ring-primary' : 'ring-white/10 hover:ring-white/30'"
                  @click="select(i)"
                >
                  <CachedImage
                    :src="img"
                    :alt="`${product.name} miniature ${i+1}`"
                    class="w-full h-full object-cover"
                    placeholder="/assets/img/default-product.jpg"
                  />
                </button>
              </div>
            </div>

            <!-- Details -->
            <div class="p-3 md:p-0 pr-3 md:pr-0 flex flex-col gap-4">
              <div class="flex items-start justify-between gap-3">
                <h2 class="text-xl md:text-3xl font-heading leading-tight">{{ product.name }}</h2>
                <span :class="['px-3 py-1 text-[11px] md:text-xs font-semibold rounded', stockClass]">
                  {{ stockLabel }}
                </span>
              </div>

              <div class="text-red-400 font-bold text-lg md:text-2xl">
                {{ product.price.toFixed(2) }} €
              </div>

              <p class="text-sm md:text-base text-gray-300 leading-relaxed">
                {{ product.description }}
              </p>

              <div class="space-y-4">
                <div v-if="sizeOptions.length > 0" class="space-y-2">
                  <span class="font-semibold text-sm">
                    {{ $t('admin.sizes') || 'Tailles' }}
                  </span>
                  <div class="flex flex-wrap gap-2">
                    <label
                      v-for="size in sizeOptions"
                      :key="`size-${size.id}`"
                      class="px-3 py-1.5 rounded-lg border cursor-pointer transition"
                      :class="sizeClass(size)"
                    >
                      <input
                        type="radio"
                        class="hidden"
                        :value="size.value"
                        :disabled="size.disabled"
                        v-model="selectedSize"
                      />
                      {{ size.label }}
                    </label>
                  </div>
                </div>

                <div v-if="colorOptions.length > 0" class="space-y-2">
                  <span class="font-semibold text-sm">
                    {{ $t('admin.colors') || 'Couleurs' }}
                  </span>
                  <div class="flex flex-wrap gap-2">
                    <label
                      v-for="color in colorOptions"
                      :key="`color-${color.id}`"
                      class="px-3 py-1.5 rounded-lg border cursor-pointer transition"
                      :class="colorClass(color)"
                    >
                      <input
                        type="radio"
                        class="hidden"
                        :value="color.value"
                        :disabled="color.disabled"
                        v-model="selectedColor"
                      />
                      {{ color.label }}
                    </label>
                  </div>
                </div>

                <div>
                  <label class="font-semibold text-sm block mb-1">{{ $t('cart.quantity') || 'Quantité' }}</label>
                  <input
                    type="number"
                    class="input w-28"
                    min="1"
                    :max="Math.max(currentStock, 1)"
                    v-model.number="quantity"
                  />
                </div>

                <p v-if="selectionError" class="text-sm text-error">
                  {{ selectionError }}
                </p>

                <button
                  class="btn btn-red w-full md:text-base disabled:opacity-60 disabled:cursor-not-allowed"
                  @click="addToCart"
                  :disabled="currentStock === 0 || !selectionValid"
                >
                  {{ currentStock === 0 ? ($t('shop.stock.outOfStock') || 'Rupture de stock') : ($t('cart.addToCart') || 'Ajouter au panier') }}
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
import { computed, reactive, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import type { Product } from '@/composables/useProducts'
import { useCart, type CartOption } from '@/composables/useCart'
import CachedImage from '@/components/CachedImage.vue'

interface OptionChoice {
  id: string
  value: string | null
  label: string
  disabled: boolean
}

const props = defineProps<{
  visible: boolean
  product: Product
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const { addItem } = useCart()
const { t: $t } = useI18n()

const index = ref(0)
const quantity = ref(1)
const selectedSize = ref<string | null>(null)
const selectedColor = ref<string | null>(null)
const selectionError = ref<string | null>(null)

const images = computed(() =>
  props.product.images?.length ? props.product.images : ['/assets/img/default-product.jpg'],
)
const hasMultiple = computed(() => images.value.length > 1)
const currentImage = computed(() => images.value[index.value] || images.value[0])

function select(i: number) {
  index.value = i
}
function prev() {
  index.value = (index.value - 1 + images.value.length) % images.value.length
}
function next() {
  index.value = (index.value + 1) % images.value.length
}

const stockMap = computed(() => {
  const map = new Map<string, number>()
  const fallbackKey = keyFor(null, null)
  for (const entry of props.product.stocks) {
    const key = keyFor(entry.size, entry.color)
    map.set(key, (map.get(key) || 0) + Math.max(0, Number(entry.stock) || 0))
  }
  if (!map.size) map.set(fallbackKey, Math.max(0, props.product.totalStock || 0))
  return map
})

function stockIdFor(size: string | null, color: string | null): string | null {
  const normalizedSize = (size ?? '').trim().toLowerCase()
  const normalizedColor = (color ?? '').trim().toLowerCase()

  const direct = props.product.stocks.find((entry) => {
    const entrySize = (entry.size ?? '').trim().toLowerCase()
    const entryColor = (entry.color ?? '').trim().toLowerCase()
    return entrySize === normalizedSize && entryColor === normalizedColor
  })
  if (direct) return direct.id

  const sizeMatch = props.product.stocks.find((entry) => {
    const entrySize = (entry.size ?? '').trim().toLowerCase()
    const entryColor = (entry.color ?? '').trim().toLowerCase()
    return entrySize === normalizedSize && !entryColor && !normalizedColor
  })
  if (sizeMatch) return sizeMatch.id

  const fallback = props.product.stocks.find((entry) => {
    const entrySize = (entry.size ?? '').trim()
    const entryColor = (entry.color ?? '').trim()
    return entrySize === '' && entryColor === ''
  })
  return fallback ? fallback.id : null
}

const sizeOptions = computed<OptionChoice[]>(() => {
  if (props.product.sizeOptions.length === 0) {
    return []
  }

  return props.product.sizeOptions.map((size) => {
    const stock = stockFor(size, selectedColor.value)
    return {
      id: `size-${size}`,
      value: size,
      label: size,
      disabled: stock <= 0,
    }
  })
})

const colorOptions = computed<OptionChoice[]>(() => {
  if (props.product.colorOptions.length === 0) {
    return []
  }

  return props.product.colorOptions.map((color) => {
    const stock = stockFor(selectedSize.value, color)
    return {
      id: `color-${color}`,
      value: color,
      label: color,
      disabled: stock <= 0,
    }
  })
})

const selectionValid = computed(() => {
  if (sizeOptions.value.length && !selectedSize.value) return false
  if (colorOptions.value.length && !selectedColor.value) return false
  return currentStock.value > 0
})

const currentStock = computed(() => {
  return stockFor(selectedSize.value, selectedColor.value)
})

const stockStatus = computed<'inStock' | 'lowStock' | 'outOfStock'>(() => {
  const stock = currentStock.value || props.product.totalStock
  if (stock <= 0) return 'outOfStock'
  if (stock < 10) return 'lowStock'
  return 'inStock'
})

const stockClass = computed(() => {
  switch (stockStatus.value) {
    case 'inStock':
      return 'bg-success/80 text-dark'
    case 'lowStock':
      return 'bg-warning/80 text-dark'
    case 'outOfStock':
      return 'bg-error/80 text-light'
  }
})

const stockLabel = computed(() => $t(`shop.stock.${stockStatus.value}`))

watch(
  () => props.visible,
  (visible) => {
    if (visible) initializeSelection()
  },
  { immediate: true },
)

function initializeSelection() {
  selectionError.value = null
  quantity.value = 1
  index.value = 0

  const firstSize = sizeOptions.value.find((opt) => !opt.disabled)
  selectedSize.value = firstSize ? firstSize.value : null

  const firstColor = colorOptions.value.find((opt) => !opt.disabled)
  selectedColor.value = firstColor ? firstColor.value : null

  if (!sizeOptions.value.length) selectedSize.value = null
  if (!colorOptions.value.length) selectedColor.value = null
}

watch(
  () => selectedSize.value,
  () => {
    if (!selectedSize.value && sizeOptions.value.length) {
      const fallback = sizeOptions.value.find((opt) => !opt.disabled)
      if (fallback) selectedSize.value = fallback.value
    }
    autoCorrectColor()
  },
)

watch(
  () => selectedColor.value,
  () => {
    if (!selectedColor.value && colorOptions.value.length) {
      const fallback = colorOptions.value.find((opt) => !opt.disabled)
      if (fallback) selectedColor.value = fallback.value
    }
    autoCorrectSize()
  },
)

function autoCorrectSize() {
  if (!sizeOptions.value.length) return
  const current = sizeOptions.value.find((opt) => opt.value === selectedSize.value)
  if (current && !current.disabled) return
  const fallback = sizeOptions.value.find((opt) => !opt.disabled)
  selectedSize.value = fallback ? fallback.value : null
}

function autoCorrectColor() {
  if (!colorOptions.value.length) return
  const current = colorOptions.value.find((opt) => opt.value === selectedColor.value)
  if (current && !current.disabled) return
  const fallback = colorOptions.value.find((opt) => !opt.disabled)
  selectedColor.value = fallback ? fallback.value : null
}

function stockFor(size: string | null, color: string | null) {
  const keyExact = keyFor(size, color)
  if (stockMap.value.has(keyExact)) return stockMap.value.get(keyExact) || 0
  const fallbackKey = keyFor(size, null)
  const fallbackColor = keyFor(null, color)
  return (
    stockMap.value.get(keyExact) ??
    stockMap.value.get(fallbackKey) ??
    stockMap.value.get(fallbackColor) ??
    stockMap.value.get(keyFor(null, null)) ??
    0
  )
}

function addToCart() {
  if (!selectionValid.value) {
    selectionError.value = $t('cart.selectionRequired') || 'Sélectionne une option disponible.'
    return
  }

  selectionError.value = null

  const selectedOptions: CartOption[] = []
  if (selectedSize.value) {
    selectedOptions.push({
      optionId: 'size',
      optionLabel: $t('admin.size') || 'Taille',
      valueLabel: selectedSize.value,
    })
  }
  if (selectedColor.value) {
    selectedOptions.push({
      optionId: 'color',
      optionLabel: $t('admin.color') || 'Couleur',
      valueLabel: selectedColor.value,
    })
  }

  const variantKey = [
    props.product.id,
    selectedSize.value || '-',
    selectedColor.value || '-',
  ].join('|')
  const stockId = stockIdFor(selectedSize.value, selectedColor.value)

  addItem({
    type: 'product',
    productId: props.product.id,
    variantId: variantKey,
    name: props.product.name,
    price: props.product.price,
    quantity: Math.max(1, Number(quantity.value) || 1),
    image: props.product.images?.[0],
    selectedOptions,
    stockStatus: stockStatus.value,
    stockId,
    size: selectedSize.value || null,
    color: selectedColor.value || null,
  })

  emit('close')
}

function close() {
  emit('close')
}

function keyFor(size: string | null, color: string | null) {
  return `${(size ?? '').toLowerCase()}__${(color ?? '').toLowerCase()}`
}

function sizeClass(option: OptionChoice) {
  if (option.disabled) return 'opacity-40 cursor-not-allowed border-white/20 bg-black/30'
  return selectedSize.value === option.value
    ? 'border-primary bg-primary/20 text-light'
    : 'border-white/20 hover:border-white/40 bg-black/30'
}

function colorClass(option: OptionChoice) {
  if (option.disabled) return 'opacity-40 cursor-not-allowed border-white/20 bg-black/30'
  return selectedColor.value === option.value
    ? 'border-primary bg-primary/20 text-light'
    : 'border-white/20 hover:border-white/40 bg-black/30'
}
</script>

<style scoped>
.input {
  @apply w-full rounded-lg border border-white/15 bg-black/30 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40;
}
.nav-btn {
  @apply absolute top-1/2 -translate-y-1/2 inline-flex items-center justify-center
  w-9 h-9 md:w-10 md:h-10 rounded-full bg-black/60 text-light
  ring-1 ring-white/20 hover:ring-white/40 transition;
}
</style>
