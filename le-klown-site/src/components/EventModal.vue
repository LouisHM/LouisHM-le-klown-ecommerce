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
        <div class="w-full h-48 sm:h-64 md:h-80 bg-zinc-800 flex items-center justify-center overflow-hidden rounded-t-2xl">
          <img
            :src="event.image_url ?? undefined"
            :alt="`Visuel de l’événement: ${event.nom}`"
            class="object-contain h-full w-full"
          />
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

// Blocage scroll arrière-plan + focus sur la carte
onMounted(() => {
  document.documentElement.classList.add('overflow-hidden') // plus robuste que body (iOS)
  requestAnimationFrame(() => panel.value?.focus())
})
onUnmounted(() => {
  document.documentElement.classList.remove('overflow-hidden')
})
</script>
