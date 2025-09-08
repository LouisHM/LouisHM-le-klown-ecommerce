<template>
  <div
    class="group relative rounded-md overflow-hidden shadow-md hover:shadow-2xl transition cursor-pointer"
    @click="showModal = true"
  >
    <!-- Zone image carrée -->
    <div class="relative aspect-square bg-black/10">
      <img
        :src="currentImage"
        :alt="product.name"
        class="absolute inset-0 w-full h-full object-cover transition-transform duration-500 md:group-hover:scale-105"
      />

        <!-- Flèche gauche -->
        <button
          v-if="hasMultiple"
          @click.stop="prev"
          class="absolute left-2 top-1/2 -translate-y-1/2
                inline-flex items-center justify-center
                w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm text-light
                md:opacity-0 md:group-hover:opacity-100 focus:opacity-100
                transition ring-1 ring-white/20 hover:ring-white/40"
          aria-label="Image précédente"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M12.293 15.707a1 1 0 01-1.414 0L5.586 10l5.293-5.707a1 1 0 111.414 1.414L8.414 10l3.879 4.293a1 1 0 010 1.414z" clip-rule="evenodd" />
          </svg>
        </button>

        <!-- Flèche droite -->
        <button
          v-if="hasMultiple"
          @click.stop="next"
          class="absolute right-2 top-1/2 -translate-y-1/2
                inline-flex items-center justify-center
                w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm text-light
                md:opacity-0 md:group-hover:opacity-100 focus:opacity-100
                transition ring-1 ring-white/20 hover:ring-white/40"
          aria-label="Image suivante"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 transform -scale-x-100" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M12.293 15.707a1 1 0 01-1.414 0L5.586 10l5.293-5.707a1 1 0 111.414 1.414L8.414 10l3.879 4.293a1 1 0 010 1.414z" clip-rule="evenodd" />
          </svg>
        </button>


      <!-- Overlay infos : slide-up au hover -->
<div
  class="absolute inset-x-0 bottom-0 z-10
         bg-dark/80 text-light p-3 pt-12
         translate-y-0 opacity-100
         md:translate-y-full md:opacity-0
         md:group-hover:translate-y-0 md:group-hover:opacity-100
         md:group-focus-within:translate-y-0 md:group-focus-within:opacity-100
         transition-all duration-500 ease-out will-change-transform"
>

        <!-- Titre + tailles -->
        <div class="flex justify-between items-start">
          <h3 class="text-base font-heading font-semibold truncate drop-shadow">
            {{ product.name }}
          </h3>
          <div v-if="product.has_sizes" class="flex flex-wrap gap-1 justify-end">
            <span
              v-for="sz in product.sizes"
              :key="sz"
              class="px-2 py-0.5 border border-white/30 rounded text-[11px] bg-black/20"
            >
              {{ sz }}
            </span>
          </div>
        </div>

        <!-- Prix + Stock -->
        <div class="mt-1 flex justify-between items-center">
          <p class="text-sm font-bold text-red-400 drop-shadow">
            {{ product.price.toFixed(2) }} €
          </p>
          <span :class="['inline-block px-2 py-1 text-[10px] font-semibold rounded', stockClass]">
            {{ $t(`shop.stock.${stockStatus}`) }}
          </span>
        </div>
      </div>

    </div>

    <!-- Modale détail (ouverture au clic sur la carte) -->
    <ProductModal
      :visible="showModal"
      :product="product"
      @close="showModal = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import ProductModal from '@/components/ProductModal.vue'

interface Product {
  id: string
  name: string
  description: string
  price: number
  sizes: string[]
  stock: number
  images: string[]
  has_sizes: boolean
}

const props = defineProps<{ product: Product }>()
const showModal = ref(false)
const index = ref(0)

const images = computed(() => props.product.images?.length ? props.product.images : ['/assets/img/default-product.jpg'])
const hasMultiple = computed(() => images.value.length > 1)
const currentImage = computed(() => images.value[index.value] || images.value[0])

function prev() {
  index.value = (index.value - 1 + images.value.length) % images.value.length
}
function next() {
  index.value = (index.value + 1) % images.value.length
}

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
</script>
