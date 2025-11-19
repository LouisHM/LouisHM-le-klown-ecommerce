<template>
  <div
    class="group relative rounded-xl overflow-hidden shadow-md hover:shadow-2xl transition cursor-pointer bg-backgroundDark/70 border border-white/10"
    @click="showModal = true"
  >
    <div class="relative aspect-square bg-black/10">
      <CachedImage
        :src="currentImage"
        :alt="pack.name"
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
        <h3 class="text-base font-semibold text-light leading-tight flex-1">{{ pack.name }}</h3>
        <span class="px-2 py-1 text-[11px] rounded font-semibold bg-primary/80 text-dark">
          {{ pack.items.length }} {{ $t('admin.packItemsShort') || 'articles' }}
        </span>
      </div>

      <div class="text-sm text-light/70 line-clamp-2">
        {{ pack.description }}
      </div>

      <div class="flex items-center justify-between text-light">
        <span class="text-lg font-bold">{{ pack.price.toFixed(2) }} €</span>
      </div>

      <ul class="text-[11px] text-light/60 space-y-1">
        <li
          v-for="item in pack.items"
          :key="item.id"
          class="truncate"
        >
          • {{ item.product?.name || '#' + item.productId }} × {{ item.quantity }}
        </li>
      </ul>
    </div>

    <PackModal
      :visible="showModal"
      :pack="pack"
      @close="showModal = false"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import PackModal from '@/components/PackModal.vue'
import type { Pack } from '@/composables/usePacks'
import CachedImage from '@/components/CachedImage.vue'

const props = defineProps<{ pack: Pack }>()
const showModal = ref(false)
const index = ref(0)

const images = computed(() =>
  props.pack.images?.length ? props.pack.images : ['/assets/img/default-product.jpg'],
)
const hasMultiple = computed(() => images.value.length > 1)
const currentImage = computed(() => images.value[index.value] || images.value[0])

function prev() {
  index.value = (index.value - 1 + images.value.length) % images.value.length
}
function next() {
  index.value = (index.value + 1) % images.value.length
}
</script>

<style scoped>
.nav-btn {
  @apply absolute top-1/2 -translate-y-1/2 inline-flex items-center justify-center w-10 h-10 rounded-full bg-black/60 text-light ring-1 ring-white/20 hover:ring-white/40 transition;
}
</style>
