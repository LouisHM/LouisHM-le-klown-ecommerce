<template>
  <li
    class="relative group w-[300px] h-[240px] rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition cursor-pointer"
    @click="$emit('click')"
  >
    <!-- Image de fond -->
    <img
      v-if="event.image_url"
      :src="event.image_url ?? undefined"
      alt="Visuel de l'événement"
      class="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 z-0"
    />

    <!-- Zone texte en bas -->
    <div
      class="absolute bottom-0 left-0 w-full bg-transparent text-light p-3 flex flex-col justify-between z-10 h-[110px]"
    >
      <!-- Titre, date, description -->
      <div class="space-y-1">
        <h3 class="text-base font-heading font-semibold truncate">{{ event.nom }}</h3>
        <p class="text-xs text-light/70 truncate">
          📍 {{ event.lieu }} • {{ formatDate(event.date) }}
        </p>
        <p v-if="event.description" class="text-xs text-light/60 line-clamp-1">
          {{ event.description }}
        </p>
      </div>

      <!-- Prix -->
      <p class="text-xs text-red-400 font-semibold mt-1">
        À partir de {{ event.prix_debut ?? '—' }} €
      </p>
    </div>

    <!-- Admin boutons -->
    <div
      v-if="editable"
      class="absolute top-2 right-2 flex gap-2 z-20"
      @click.stop
    >
      <button @click="$emit('edit', event)" class="text-xs px-2 py-1 rounded bg-accent text-light hover:bg-light hover:text-dark transition">✏️</button>
      <button @click="$emit('delete', event.id)" class="text-xs px-2 py-1 rounded bg-red-600 text-light hover:bg-light hover:text-dark transition">🗑️</button>
    </div>
  </li>
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

const { event, editable = false } = defineProps<{ event: DBEvent; editable?: boolean }>()

const emit = defineEmits<{
  (e: 'click'): void
  (e: 'edit', event: DBEvent): void
  (e: 'delete', id: number | string): void
}>()

function formatDate(dateStr?: string) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return Number.isNaN(d.getTime()) ? dateStr : d.toLocaleDateString()
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
