<template>
  <Teleport to="body">
    <!-- Backdrop -->
    <div
      class="fixed inset-0 z-[999] bg-black/70 backdrop-blur-sm flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      :aria-label="`Modal événement: ${event.nom}`"
      @click.self="$emit('close')"
      @keydown.esc.stop.prevent="$emit('close')"
    >
      <!-- Panel (scrolls as a whole) -->
      <div
        ref="panel"
        tabindex="-1"
        class="relative w-full h-[100vh] md:h-auto md:max-h-[90vh] md:mx-6 md:rounded-2xl md:overflow-hidden
               bg-zinc-900 text-light shadow-2xl focus:outline-none overflow-y-auto"
      >
        <!-- Close (always on top) -->
        <button
          @click="$emit('close')"
          class="absolute top-3 right-3 z-50 inline-flex items-center justify-center w-9 h-9 rounded-full
                 bg-black/60 text-white border border-white/20 hover:bg-black/80 transition"
          aria-label="Fermer"
        >
          ✕
        </button>

        <!-- Image -->
        <div class="w-full h-[40vh] md:h-[400px] bg-zinc-800 flex items-center justify-center overflow-hidden">
          <img
            :src="event.image_url ?? undefined"
            :alt="`Visuel de l’événement: ${event.nom}`"
            class="object-contain h-full w-full"
          />
        </div>

        <!-- Content -->
        <div class="p-5 md:p-6 space-y-4">
          <h2 class="text-2xl md:text-3xl font-heading leading-tight">{{ event.nom }}</h2>

          <p class="text-light/70 text-sm md:text-base">
            📍 {{ event.lieu ?? '' }} — {{ formatDate(event.date) }}
          </p>

          <p class="text-primary font-medium text-lg">
            À partir de {{ event.prix_debut ?? '—' }} €
          </p>

          <p v-if="event.description" class="text-base mt-2 whitespace-pre-line">
            {{ event.description }}
          </p>

          <!-- Links -->
          <div class="flex flex-wrap gap-4 pt-2">
            <a
              v-if="event.billeterie_url"
              :href="event.billeterie_url"
              target="_blank"
              class="underline text-secondary hover:opacity-90"
              rel="noopener noreferrer"
            >
              Billetterie
            </a>
            <a
              v-if="event.insta_url"
              :href="event.insta_url"
              target="_blank"
              class="underline text-secondary hover:opacity-90"
              rel="noopener noreferrer"
            >
              Instagram
            </a>
          </div>

          <!-- Bottom spacing so the last lines don't stick to the screen edge on mobile -->
          <div class="h-2"></div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'

type DBEvent = {
  id: number | string
  nom: string
  lieu?: string
  date?: string
  description?: string | null
  image_url?: string | null
  prix_debut?: number | null
  billeterie_url?: string | null
  insta_url?: string | null
}

defineEmits<{ (e: 'close'): void }>()
const props = defineProps<{ event: DBEvent }>()
const panel = ref<HTMLElement | null>(null)

function formatDate(dateStr?: string) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return Number.isNaN(d.getTime()) ? dateStr : d.toLocaleDateString()
}

// Lock background scroll + focus the panel on mount
onMounted(() => {
  document.documentElement.classList.add('overflow-hidden')
  // focus after paint for Esc handling
  requestAnimationFrame(() => panel.value?.focus())
})

onUnmounted(() => {
  document.documentElement.classList.remove('overflow-hidden')
})
</script>
