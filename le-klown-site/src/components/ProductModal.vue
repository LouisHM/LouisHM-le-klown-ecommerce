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
              <div
                class="relative flex items-center justify-center rounded-xl bg-black/10 overflow-hidden
                       h-[60vh] md:h-auto md:aspect-square"
              >
                <img
                  :src="currentImage"
                  :alt="product.name"
                  class="w-full h-full object-contain"
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
              <div class="mt-4 space-y-4">
                <div
                  v-for="option in product.options"
                  :key="option.id"
                  class="space-y-2"
                >
                  <label class="font-semibold block text-xs md:text-sm">
                    {{ option.label }}
                    <span v-if="option.required" class="text-red-400">*</span>
                  </label>

                  <div v-if="!option.multi">
                    <select
                      class="w-full h-[42px] md:h-[44px] px-3 rounded-lg border bg-dark text-light focus:outline-none"
                      :class="selectionErrors[option.id] ? 'border-error ring-1 ring-error' : 'border-gray-600 focus:border-gray-400'"
                      :value="(selectedOptions[option.id] ?? [])[0] ?? ''"
                      @change="onSelectChange(option.id, $event)"
                    >
                      <option value="">
                        {{ $t('cart.chooseSize') || `Choisis ${option.label.toLowerCase()}` }}
                      </option>
                      <option
                        v-for="value in option.values"
                        :key="value.id"
                        :value="value.id"
                      >
                        {{ value.label }}
                      </option>
                    </select>
                  </div>
                  <div v-else class="flex flex-wrap gap-2">
                    <label
                      v-for="value in option.values"
                      :key="value.id"
                      class="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-600 cursor-pointer bg-dark/40 hover:border-gray-400"
                    >
                      <input
                        type="checkbox"
                        class="accent-primary rounded"
                        :checked="isValueSelected(option.id, value.id)"
                        @change="onToggleChange(option.id, value.id, $event)"
                      />
                      <span class="text-sm">{{ value.label }}</span>
                    </label>
                  </div>

                  <p
                    v-if="selectionErrors[option.id]"
                    class="text-sm text-error"
                    role="alert"
                  >
                    {{ selectionErrors[option.id] }}
                  </p>
                </div>

                <div class="flex gap-3 items-end">
                  <div class="flex-1">
                    <label class="font-semibold mb-1 block text-xs md:text-sm">{{ $t('cart.quantity') }}</label>
                    <input
                      type="number"
                      v-model.number="quantity"
                      min="1"
                      :max="Math.max(currentStock, 1)"
                      class="w-full h-[42px] md:h-[44px] px-3 rounded-lg border bg-dark text-light border-gray-600
                             focus:outline-none focus:border-gray-400"
                    />
                  </div>
                </div>

                <p v-if="selectionErrors._variant" class="text-sm text-error" role="alert">
                  {{ selectionErrors._variant }}
                </p>

                <button
                  @click="addToCart"
                  :disabled="currentStock === 0 || (product.options.length > 0 && !selectionComplete)"
                  class="btn btn-red w-full md:text-base disabled:opacity-60 disabled:cursor-not-allowed"
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
import { useCart } from '@/composables/useCart'
import type { Product, ProductVariant } from '@/composables/useProducts'

const props = defineProps<{ visible: boolean; product: Product }>()
const emit = defineEmits(['close'])
const { addItem } = useCart()

const quantity = ref<number>(1)
const selectedOptions = reactive<Record<string, string[]>>({})
const selectionErrors = reactive<Record<string, string>>({})
const index = ref(0)

const images = computed(() =>
  props.product?.images?.length ? props.product.images : ['/assets/img/default-product.jpg']
)
const hasMultiple = computed(() => images.value.length > 1)
const currentImage = computed(() => images.value[index.value] || images.value[0])

function select(i: number) { index.value = i }
function prev() { index.value = (index.value - 1 + images.value.length) % images.value.length }
function next() { index.value = (index.value + 1) % images.value.length }

const selectedValueIds = computed<string[]>(() =>
  Object.values(selectedOptions).flat().map(String)
)

const selectionComplete = computed(() => {
  if (!props.product || props.product.options.length === 0) return true
  return props.product.options.every(option => {
    if (!option.required) return true
    const values = selectedOptions[option.id] ?? []
    return Array.isArray(values) && values.length > 0
  })
})

const activeVariant = computed<ProductVariant | null>(() => {
  if (!Array.isArray(props.product?.variants)) return null
  if (props.product.options.length === 0) {
    return props.product.variants[0] ?? null
  }
  if (!selectionComplete.value) return null

  const target = [...selectedValueIds.value].sort()

  return props.product.variants.find(variant => {
    const values = Array.isArray(variant.optionValueIds)
      ? variant.optionValueIds.map(String).sort()
      : []
    if (values.length !== target.length) return false
    return values.every((valueId, idx) => valueId === target[idx])
  }) ?? null
})

const currentStock = computed(() => activeVariant.value?.stock ?? props.product.totalStock)

const stockStatus = computed<'inStock' | 'lowStock' | 'outOfStock'>(() => {
  const stock = currentStock.value
  if (stock <= 0) return 'outOfStock'
  if (stock < 10) return 'lowStock'
  return 'inStock'
})

const stockClass = computed(() => {
  switch (stockStatus.value) {
    case 'inStock': return 'bg-success text-dark'
    case 'lowStock': return 'bg-warning text-dark'
    case 'outOfStock': return 'bg-error text-light'
  }
})

function clearSelections() {
  for (const key of Object.keys(selectedOptions)) delete selectedOptions[key]
  for (const key of Object.keys(selectionErrors)) delete selectionErrors[key]
}

function ensureDefaultSelections() {
  for (const option of props.product.options) {
    if (option.values.length === 1) {
      selectedOptions[option.id] = [option.values[0].id]
    }
  }
}

function resetState() {
  clearSelections()
  ensureDefaultSelections()
  quantity.value = 1
  index.value = 0
}

function selectSingle(optionId: string, valueId: string) {
  if (valueId) selectedOptions[optionId] = [valueId]
  else delete selectedOptions[optionId]
  if (selectedOptions[optionId]?.length) delete selectionErrors[optionId]
}

function toggleValue(optionId: string, valueId: string, checked: boolean) {
  const current = selectedOptions[optionId] ?? []
  const next = checked
    ? Array.from(new Set([...current, valueId]))
    : current.filter(id => id !== valueId)

  if (next.length > 0) selectedOptions[optionId] = next
  else delete selectedOptions[optionId]

  if ((selectedOptions[optionId] ?? []).length > 0) delete selectionErrors[optionId]
}

function isValueSelected(optionId: string, valueId: string) {
  return (selectedOptions[optionId] ?? []).includes(valueId)
}

function onSelectChange(optionId: string, event: Event) {
  const target = event.target as HTMLSelectElement
  selectSingle(optionId, target.value)
}

function onToggleChange(optionId: string, valueId: string, event: Event) {
  const target = event.target as HTMLInputElement
  toggleValue(optionId, valueId, target.checked)
}

function buildSelectedOptionSummary() {
  const summary: { optionId: string; optionLabel: string; valueLabel: string }[] = []
  for (const option of props.product.options) {
    const values = selectedOptions[option.id] ?? []
    for (const valueId of values) {
      const value = option.values.find(v => v.id === valueId)
      if (value) {
        summary.push({
          optionId: option.id,
          optionLabel: option.label,
          valueLabel: value.label,
        })
      }
    }
  }
  return summary
}

function validateSelections(): boolean {
  let valid = true
  for (const option of props.product.options) {
    const values = selectedOptions[option.id] ?? []
    if (option.required && values.length === 0) {
      selectionErrors[option.id] = option.multi
        ? 'Choisis au moins une valeur.'
        : 'Choisis une option.'
      valid = false
    } else {
      delete selectionErrors[option.id]
    }
  }
  return valid
}

function close() { emit('close') }

function addToCart() {
  if (!validateSelections()) return

  const variant = activeVariant.value ?? props.product.variants[0] ?? null
  if (!variant) {
    selectionErrors['_variant'] = 'Cette configuration est indisponible.'
    return
  }
  if (variant.stock <= 0) {
    selectionErrors['_variant'] = 'Cette configuration est en rupture.'
    return
  }
  delete selectionErrors['_variant']

  const max = Math.max(1, variant.stock)
  const q = Math.max(1, Math.min(Number(quantity.value) || 1, max))
  quantity.value = q

  const selectedOptionSummary = buildSelectedOptionSummary()

  addItem({
    productId: props.product.id,
    variantId: variant.id,
    name: props.product.name,
    price: props.product.price,
    quantity: q,
    image: props.product.images?.[0] || undefined,
    selectedOptions: selectedOptionSummary,
  })

  close()
}

watch(() => props.product, () => {
  resetState()
}, { immediate: true })

watch(currentStock, (stock) => {
  if (stock > 0 && quantity.value > stock) {
    quantity.value = stock
  }
  if (stock <= 0) {
    quantity.value = 1
  }
})

watch(() => props.visible, (visible) => {
  const html = document.documentElement
  if (visible) {
    resetState()
    const scrollBarComp = window.innerWidth - html.clientWidth
    html.style.overflow = 'hidden'
    if (scrollBarComp > 0) html.style.paddingRight = scrollBarComp + 'px'
  } else {
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
