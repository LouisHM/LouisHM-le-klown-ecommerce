<template>
  <Teleport to="body">
    <!-- Backdrop -->
    <div
      class="fixed inset-0 z-[999] bg-black/70 backdrop-blur-sm flex items-center justify-center px-3 sm:px-4"
      role="dialog"
      aria-modal="true"
      :aria-label="`Modal événement: ${event.nom}`"
      @click.self="$emit('close')"
      @keydown.esc.stop.prevent="$emit('close')"
    >
      <!-- Panel (carte centrée, scroll interne) -->
      <div
        ref="panel"
        tabindex="-1"
        class="relative w-[94vw] max-w-lg sm:max-w-xl md:max-w-2xl
               max-h-[86vh] overflow-y-auto rounded-2xl bg-zinc-900 text-light shadow-2xl
               focus:outline-none ring-1 ring-black/10"
      >
        <!-- Close (réactif à la taille de la carte) -->
        <button
          @click="$emit('close')"
          class="absolute sm:top-3 sm:right-3 top-2 right-2 z-50 inline-flex items-center justify-center
                 w-9 h-9 rounded-full bg-black/60 text-white border border-white/20
                 hover:bg-black/80 transition"
          aria-label="Fermer"
        >
          ✕
        </button>

        <!-- Image -->
        <div class="w-full bg-zinc-800 flex items-center justify-center overflow-hidden rounded-t-2xl relative" :class="imageContainerClasses">
          <template v-if="currentImage">
            <CachedImage
              :src="currentImage"
              :alt="`Visuel de l’événement: ${event.nom}`"
              class="object-contain h-full w-full"
              placeholder="/assets/img/default-product.jpg"
            />
            <button
              v-if="hasMultiple"
              class="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80 transition"
              @click.stop="prev"
              aria-label="Image précédente"
            >
              ‹
            </button>
            <button
              v-if="hasMultiple"
              class="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80 transition"
              @click.stop="next"
              aria-label="Image suivante"
            >
              ›
            </button>
          </template>
          <div v-else class="flex flex-col items-center justify-center text-light/60 text-sm sm:text-base gap-1">
            <span>{{ $t('admin.noImage') || 'Aucune image disponible' }}</span>
          </div>
        </div>

        <div
          v-if="hasMultiple"
          class="flex gap-2 px-4 py-3 overflow-x-auto border-b border-white/10 bg-zinc-900/80"
        >
          <button
            v-for="(img, index) in images"
            :key="index"
            @click.prevent="select(index)"
            class="w-12 h-12 sm:w-14 sm:h-14 rounded-lg overflow-hidden border transition"
            :class="index === currentIndex ? 'border-primary ring-2 ring-primary/60' : 'border-white/10 hover:border-primary/60'"
          >
            <CachedImage
              :src="img"
              alt="Miniature"
              class="w-full h-full object-cover"
              placeholder="/assets/img/default-product.jpg"
            />
          </button>
        </div>

        <!-- Contenu -->
        <div class="p-4 sm:p-5 md:p-6 space-y-4">
          <h2 class="text-2xl md:text-3xl font-heading leading-tight">
            {{ event.nom }}
          </h2>

          <p class="text-light/70 text-sm md:text-base">
            📍 {{ event.lieu ?? '' }} — {{ formatDate(event.date) }}
          </p>

          <p class="text-primary font-medium text-lg">
            À partir de {{ event.prix_debut ?? '—' }} €
          </p>

          <p v-if="event.description" class="text-base whitespace-pre-line">
            {{ event.description }}
          </p>

          <!-- Liens -->
          <div class="flex flex-wrap gap-4 pt-2">
            <a
              v-if="event.billeterie_url"
              :href="event.billeterie_url"
              target="_blank"
              rel="noopener noreferrer"
              class="underline text-secondary hover:opacity-90"
            >Billetterie</a>
            <a
              v-if="event.insta_url"
              :href="event.insta_url"
              target="_blank"
              rel="noopener noreferrer"
              class="underline text-secondary hover:opacity-90"
            >Instagram</a>
          </div>

          <!-- petit espace bas pour aérer sur mobile -->
          <div class="h-1"></div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import type { EventRecord } from '@/composables/useEvents'
import CachedImage from '@/components/CachedImage.vue'

defineEmits<{ (e: 'close'): void }>()
const props = defineProps<{ event: EventRecord }>()
const panel = ref<HTMLElement | null>(null)

const images = computed(() => {
  if (Array.isArray(props.event.images) && props.event.images.length) {
    return props.event.images.filter(Boolean)
  }
  if (props.event.image_url) return [props.event.image_url]
  return []
})

const currentIndex = ref(0)
const hasMultiple = computed(() => images.value.length > 1)
const currentImage = computed(() => images.value[currentIndex.value] ?? null)

function prev() {
  if (!hasMultiple.value) return
  currentIndex.value = (currentIndex.value - 1 + images.value.length) % images.value.length
}

function next() {
  if (!hasMultiple.value) return
  currentIndex.value = (currentIndex.value + 1) % images.value.length
}

function select(index: number) {
  if (index >= 0 && index < images.value.length) currentIndex.value = index
}

watch(() => props.event, () => {
  currentIndex.value = 0
})

const imageContainerClasses = computed(() => {
  if (images.value.length === 0) return 'h-48 sm:h-56 md:h-64'
  return 'h-48 sm:h-64 md:h-80'
})

function formatDate(dateStr?: string) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return Number.isNaN(d.getTime()) ? dateStr : d.toLocaleDateString()
}

// Blocage scroll arrière-plan + focus sur la carte
onMounted(() => {
  document.documentElement.classList.add('overflow-hidden') // plus robuste que body (iOS)
  requestAnimationFrame(() => panel.value?.focus())
})
onUnmounted(() => {
  document.documentElement.classList.remove('overflow-hidden')
})
</script>
