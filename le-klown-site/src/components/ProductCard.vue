<template>
  <div
    class="group relative rounded-xl overflow-hidden shadow-md hover:shadow-2xl transition cursor-pointer bg-backgroundDark/70 border border-white/10"
    @click="showModal = true"
  >
    <div class="relative aspect-square bg-black/10">
      <CachedImage
        :src="currentImage"
        :alt="product.name"
        class="absolute inset-0 w-full h-full object-cover transition-transform duration-500 md:group-hover:scale-105"
        placeholder="/assets/img/default-product.jpg"
      />

      <button
        v-if="hasMultiple"
        class="nav-btn left-2"
        @click.stop="prev"
        aria-label="Image précédente"
      >
        <i class="fa-solid fa-chevron-left"></i>
      </button>
      <button
        v-if="hasMultiple"
        class="nav-btn right-2"
        @click.stop="next"
        aria-label="Image suivante"
      >
        <i class="fa-solid fa-chevron-right"></i>
      </button>
    </div>

    <div class="p-4 flex flex-col gap-3">
      <div class="flex items-start justify-between gap-3">
        <h3 class="text-base font-semibold text-light leading-tight flex-1">{{ product.name }}</h3>
      </div>

      <div class="text-sm text-light/70 line-clamp-2">
        {{ product.description }}
      </div>

      <div class="flex items-center justify-between text-light">
        <span class="text-lg font-bold">{{ product.price.toFixed(2) }} €</span>
        <span
          class="inline-flex items-center px-2 py-0.5 text-[11px] font-semibold rounded"
          :class="stockClass"
        >
          {{ stockLabel }}
        </span>
      </div>

      <div v-if="product.sizeOptions.length" class="flex flex-wrap gap-1 text-[11px] text-light/70">
        <span
          v-for="size in product.sizeOptions"
          :key="`size-${size}`"
          class="px-2 py-0.5 border border-white/20 rounded-lg bg-black/20"
        >
          {{ size }}
        </span>
      </div>

      <div v-if="product.colorOptions.length" class="flex flex-wrap gap-1 text-[11px] text-light/70">
        <span
          v-for="color in product.colorOptions"
          :key="`color-${color}`"
          class="px-2 py-0.5 border border-white/20 rounded-lg bg-black/20"
        >
          {{ color }}
        </span>
      </div>
    </div>

    <ProductModal
      :visible="showModal"
      :product="product"
      @close="showModal = false"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import ProductModal from '@/components/ProductModal.vue'
import type { Product } from '@/composables/useProducts'
import CachedImage from '@/components/CachedImage.vue'

const props = defineProps<{ product: Product }>()
const { t } = useI18n()
const showModal = ref(false)
const index = ref(0)

const images = computed(() =>
  props.product.images?.length ? props.product.images : ['/assets/img/default-product.jpg'],
)
const hasMultiple = computed(() => images.value.length > 1)
const currentImage = computed(() => images.value[index.value] || images.value[0])

function prev() {
  index.value = (index.value - 1 + images.value.length) % images.value.length
}
function next() {
  index.value = (index.value + 1) % images.value.length
}

const stockStatus = computed<'inStock' | 'lowStock' | 'outOfStock'>(() => {
  const stock = props.product.totalStock
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

const stockLabel = computed(() => t(`shop.stock.${stockStatus.value}`))
</script>

<style scoped>
.nav-btn {
  @apply absolute top-1/2 -translate-y-1/2 inline-flex items-center justify-center w-10 h-10 rounded-full bg-black/60 text-light ring-1 ring-white/20 hover:ring-white/40 transition;
}
</style>
