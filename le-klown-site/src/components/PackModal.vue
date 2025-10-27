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
                <img :src="currentImage" :alt="pack.name" class="w-full h-full object-contain" />

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
                  <img :src="img" :alt="`${pack.name} miniature ${i+1}`" class="w-full h-full object-cover" />
                </button>
              </div>
            </div>

            <!-- Details -->
            <div class="p-3 md:p-0 pr-3 md:pr-0 flex flex-col gap-4">
              <div class="flex items-start justify-between gap-3">
                <h2 class="text-xl md:text-3xl font-heading leading-tight">{{ pack.name }}</h2>
                <span class="px-3 py-1 text-[11px] md:text-xs font-semibold rounded bg-primary/80 text-dark">
                  {{ pack.items.length }} {{ $t('admin.packItemsShort') || 'articles' }}
                </span>
              </div>

              <div class="text-red-400 font-bold text-lg md:text-2xl">
                {{ pack.price.toFixed(2) }} €
              </div>

              <p class="text-sm md:text-base text-gray-300 leading-relaxed">
                {{ pack.description }}
              </p>

              <div class="space-y-5 overflow-y-auto pr-2 md:pr-0">
                <article
                  v-for="item in pack.items"
                  :key="item.id"
                  class="bg-white/5 border border-white/10 rounded-lg p-3 space-y-3"
                >
                  <header class="flex justify-between items-start gap-3">
                    <div>
                      <h3 class="font-semibold text-sm">{{ item.product?.name || '#' + item.productId }}</h3>
                      <p class="text-xs text-light/60">{{ $t('admin.quantity') || 'Quantité' }} : {{ item.quantity }}</p>
                    </div>
                    <span
                      class="inline-flex items-center px-2 py-0.5 text-[11px] font-semibold rounded"
                      :class="stockBadgeClass(stockStatusForItem(item))"
                    >
                      {{ stockStatusText(stockStatusForItem(item)) }}
                    </span>
                  </header>

                  <div v-if="item.product">
                    <div v-if="sizeOptions(item).length" class="space-y-1">
                      <span class="text-xs font-semibold">{{ $t('admin.size') || 'Taille' }}</span>
                      <div class="flex flex-wrap gap-2">
                        <label
                          v-for="opt in sizeOptions(item)"
                          :key="opt.id"
                          class="px-2 py-1 rounded-lg border cursor-pointer text-xs"
                          :class="opt.disabled ? 'opacity-40 cursor-not-allowed' : selections[item.id].size === opt.value ? 'border-primary bg-primary/20 text-light' : 'border-white/20 hover:border-white/40 bg-black/30'"
                        >
                          <input
                            type="radio"
                            class="hidden"
                            :value="opt.value"
                            :disabled="opt.disabled"
                            v-model="selections[item.id].size"
                          />
                          {{ opt.label }}
                        </label>
                      </div>
                    </div>

                    <div v-if="colorOptions(item).length" class="space-y-1 mt-3">
                      <span class="text-xs font-semibold">{{ $t('admin.color') || 'Couleur' }}</span>
                      <div class="flex flex-wrap gap-2">
                        <label
                          v-for="opt in colorOptions(item)"
                          :key="opt.id"
                          class="px-2 py-1 rounded-lg border cursor-pointer text-xs"
                          :class="opt.disabled ? 'opacity-40 cursor-not-allowed' : selections[item.id].color === opt.value ? 'border-primary bg-primary/20 text-light' : 'border-white/20 hover:border-white/40 bg-black/30'"
                        >
                          <input
                            type="radio"
                            class="hidden"
                            :value="opt.value"
                            :disabled="opt.disabled"
                            v-model="selections[item.id].color"
                          />
                          {{ opt.label }}
                        </label>
                      </div>
                    </div>

                    <div
                      v-if="!hasSelectableOptions(item)"
                      class="mt-2"
                    >
                      <span class="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-white/10 text-[11px] uppercase tracking-wide text-light/70">
                        <i class="fa-solid fa-check text-[10px]"></i>
                        {{ $t('cart.singleSize') || 'Taille unique' }}
                      </span>
                    </div>
                  </div>
                </article>
              </div>

              <p v-if="selectionError" class="text-sm text-error">
                {{ selectionError }}
              </p>

              <button
                class="btn btn-red w-full md:text-base disabled:opacity-60 disabled:cursor-not-allowed"
                :disabled="!allSelectionsValid"
                @click="addPackToCart"
              >
                {{ allSelectionsValid ? ($t('cart.addToCart') || 'Ajouter au panier') : ($t('cart.selectionRequired') || 'Sélectionne les options') }}
              </button>
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
import type { Pack, PackItem } from '@/composables/usePacks'
import type { Product } from '@/composables/useProducts'
import { useCart, type CartOption } from '@/composables/useCart'

interface OptionChoice {
  id: string
  value: string | null
  label: string
  disabled: boolean
}

const props = defineProps<{
  visible: boolean
  pack: Pack
}>()

const emit = defineEmits<{ (e: 'close'): void }>()

const { addItem } = useCart()
const { t: $t } = useI18n()

const index = ref(0)
const selectionError = ref<string | null>(null)

const images = computed(() =>
  props.pack.images?.length ? props.pack.images : ['/assets/img/default-product.jpg'],
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

const selections = reactive<Record<string, { size: string | null; color: string | null }>>({})

function initializeSelections() {
  selectionError.value = null
  for (const item of props.pack.items) {
    selections[item.id] = {
      size: defaultSize(item),
      color: defaultColor(item),
    }
  }
}

watch(
  () => props.visible,
  (visible) => {
    if (visible) initializeSelections()
  },
  { immediate: true },
)

function stockStatusForItem(item: PackItem): 'inStock' | 'lowStock' | 'outOfStock' {
  const product = item.product
  if (!product) return 'outOfStock'
  const selection = selections[item.id]
  const size = selection?.size ?? null
  const color = selection?.color ?? null
  const available = stockFor(product, size, color)
  if (available <= 0) return 'outOfStock'
  if (available < 10) return 'lowStock'
  return 'inStock'
}

function stockBadgeClass(status: 'inStock' | 'lowStock' | 'outOfStock') {
  switch (status) {
    case 'inStock':
      return 'bg-success/80 text-dark'
    case 'lowStock':
      return 'bg-warning/80 text-dark'
    default:
      return 'bg-error/80 text-light'
  }
}

function stockStatusText(status: 'inStock' | 'lowStock' | 'outOfStock') {
  return $t(`shop.stock.${status}`)
}

function defaultSize(item: PackItem) {
  const product = item.product
  if (!product || product.sizeOptions.length === 0) return null
  const available = sizeOptions(item).find((opt) => !opt.disabled)
  return available ? available.value : null
}

function defaultColor(item: PackItem) {
  const product = item.product
  if (!product || product.colorOptions.length === 0) return null
  const available = colorOptions(item).find((opt) => !opt.disabled)
  return available ? available.value : null
}

function hasSelectableOptions(item: PackItem) {
  const product = item.product
  if (!product) return false
  return product.sizeOptions.length > 0 || product.colorOptions.length > 0
}

function sizeOptions(item: PackItem): OptionChoice[] {
  const product = item.product
  if (!product || product.sizeOptions.length === 0) return []

  const currentColor = selections[item.id]?.color ?? null
  return product.sizeOptions.map((size) => {
    const stock = stockFor(product, size, currentColor)
    return {
      id: `size-${item.id}-${size}`,
      value: size,
      label: size,
      disabled: stock <= 0,
    }
  })
}

function colorOptions(item: PackItem): OptionChoice[] {
  const product = item.product
  if (!product || product.colorOptions.length === 0) return []

  const currentSize = selections[item.id]?.size ?? null
  return product.colorOptions.map((color) => {
    const stock = stockFor(product, currentSize, color)
    return {
      id: `color-${item.id}-${color}`,
      value: color,
      label: color,
      disabled: stock <= 0,
    }
  })
}

function stockFor(product: Product | undefined | null, size: string | null, color: string | null) {
  if (!product) return 0
  const map = new Map<string, number>()
  for (const entry of product.stocks) {
    const key = keyFor(entry.size, entry.color)
    map.set(key, (map.get(key) || 0) + Math.max(0, Number(entry.stock) || 0))
  }
  if (!map.size) {
    map.set(keyFor(null, null), Math.max(0, product.totalStock || 0))
  }

  const exact = keyFor(size, color)
  if (map.has(exact)) return map.get(exact) || 0
  const fallbackSize = keyFor(size, null)
  const fallbackColor = keyFor(null, color)
  return (
    map.get(exact) ??
    map.get(fallbackSize) ??
    map.get(fallbackColor) ??
    map.get(keyFor(null, null)) ??
    0
  )
}

function stockIdForProduct(product: Product | undefined | null, size: string | null, color: string | null): string | null {
  if (!product) return null
  const normalizedSize = (size ?? '').trim().toLowerCase()
  const normalizedColor = (color ?? '').trim().toLowerCase()

  const direct = product.stocks.find((entry) => {
    const entrySize = (entry.size ?? '').trim().toLowerCase()
    const entryColor = (entry.color ?? '').trim().toLowerCase()
    return entrySize === normalizedSize && entryColor === normalizedColor
  })
  if (direct) return direct.id

  const sizeMatch = product.stocks.find((entry) => {
    const entrySize = (entry.size ?? '').trim().toLowerCase()
    const entryColor = (entry.color ?? '').trim().toLowerCase()
    return entrySize === normalizedSize && entryColor === '' && normalizedColor === ''
  })
  if (sizeMatch) return sizeMatch.id

  const fallback = product.stocks.find((entry) => {
    const entrySize = (entry.size ?? '').trim()
    const entryColor = (entry.color ?? '').trim()
    return entrySize === '' && entryColor === ''
  })
  return fallback ? fallback.id : null
}

const allSelectionsValid = computed(() => {
  for (const item of props.pack.items) {
    const product = item.product
    if (!product) continue

    const selection = selections[item.id]
    const requiresSize = product.sizeOptions.length > 0
    const requiresColor = product.colorOptions.length > 0
    const requiresSelection = requiresSize || requiresColor

    if (!selection) {
      if (requiresSelection) return false
      continue
    }

    if (requiresSize && !selection.size) return false
    if (requiresColor && !selection.color) return false
    if (!requiresSelection) continue

    const sizeValue = requiresSize ? selection.size : null
    const colorValue = requiresColor ? selection.color : null
    if (stockFor(product, sizeValue, colorValue) <= 0) return false
  }
  return true
})

function addPackToCart() {
  if (!allSelectionsValid.value) {
    selectionError.value = $t('cart.selectionRequired') || 'Sélectionne les options pour chaque produit.'
    return
  }

  const selectedOptions: CartOption[] = []
  const selectionSummary: string[] = []

  const detailedItems = props.pack.items.map((item) => {
    const product = item.product
    const selection = selections[item.id]
    const size = selection?.size ?? null
    const color = selection?.color ?? null
    const stockId = stockIdForProduct(product, size, color)

    if (product) {
      if (size) {
        selectedOptions.push({
          optionId: `${product.id}-size`,
          optionLabel: `${product.name} — ${$t('admin.size') || 'Taille'}`,
          valueLabel: size,
        })
      }
      if (color) {
        selectedOptions.push({
          optionId: `${product.id}-color`,
          optionLabel: `${product.name} — ${$t('admin.color') || 'Couleur'}`,
          valueLabel: color,
        })
      }

      selectionSummary.push(
        [product.name, size, color]
          .filter(Boolean)
          .join(' / '),
      )
    }

    return {
      raw: item,
      product,
      size,
      color,
      stockId,
    }
  })

  const variantId = [
    'pack',
    props.pack.id,
    selectionSummary.join('|') || 'default',
  ].join(':')

  addItem({
    type: 'pack',
    packId: props.pack.id,
    variantId,
    name: props.pack.name,
    price: props.pack.price,
    quantity: 1,
    image: props.pack.images?.[0],
    selectedOptions,
    packItems: detailedItems.map(({ raw, product, size, color, stockId }) => ({
      productId: raw.productId,
      productName: product?.name || '#' + raw.productId,
      size,
      color,
      quantity: raw.quantity,
      stockId,
    })),
  })

  emit('close')
}

function close() {
  emit('close')
}

function keyFor(size: string | null, color: string | null) {
  return `${(size ?? '').toLowerCase()}__${(color ?? '').toLowerCase()}`
}
</script>

<style scoped>
.nav-btn {
  @apply absolute top-1/2 -translate-y-1/2 inline-flex items-center justify-center
  w-9 h-9 md:w-10 md:h-10 rounded-full bg-black/60 text-light
  ring-1 ring-white/20 hover:ring-white/40 transition;
}
</style>
