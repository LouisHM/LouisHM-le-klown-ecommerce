<template>
  <div
    class="fixed inset-0 z-[999] bg-black bg-opacity-70 backdrop-blur-sm flex items-center justify-center px-4"
    @click.self="$emit('close')"
  >
    <div class="relative max-w-3xl w-full bg-zinc-900 text-light rounded-2xl overflow-hidden shadow-2xl">
      <!-- Close -->
      <button
        @click="$emit('close')"
        class="absolute top-4 right-4 bg-black bg-opacity-50 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-opacity-80 transition z-50"
        aria-label="Fermer"
      >
        ✕
      </button>

      <!-- Image -->
      <div class="w-full h-[400px] bg-zinc-800 flex items-center justify-center overflow-hidden">
        <img
          :src="event.image_url ?? undefined"
          :alt="`Visuel de l’événement: ${event.nom}`"
          class="object-contain h-full w-full rounded-t-2xl"
        />
      </div>

      <!-- Contenu -->
      <div class="p-6 space-y-4">
        <h2 class="text-3xl font-heading">{{ event.nom }}</h2>
        <p class="text-light/70 text-sm">
          📍 {{ event.lieu ?? '' }} — {{ formatDate(event.date) }}
        </p>
        <p class="text-primary font-medium text-lg">
          À partir de {{ event.prix_debut ?? '—' }} €
        </p>
        <p v-if="event.description" class="text-base max-h-40 overflow-scroll mt-4">
          {{ event.description }}
        </p>

        <!-- Liens -->
        <div class="flex flex-wrap gap-4 mt-4">
          <a v-if="event.billeterie_url" :href="event.billeterie_url" target="_blank" class="underline text-secondary">Billetterie</a>
          <a v-if="event.insta_url" :href="event.insta_url" target="_blank" class="underline text-secondary">Instagram</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
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

defineEmits<{ (e: 'close'): void }>()             // ✅ typé pour $emit('close')
const props = defineProps<{ event: DBEvent }>()   // ✅ prop requise

function formatDate(dateStr?: string) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return Number.isNaN(d.getTime()) ? dateStr : d.toLocaleDateString()
}
</script>

<style scoped>
@keyframes fadeIn {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}
.animate-fadeIn {
  animation: fadeIn 0.3s ease-out;
}
</style>
