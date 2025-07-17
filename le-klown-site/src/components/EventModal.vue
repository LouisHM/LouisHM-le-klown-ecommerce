<template>
  <div
    class="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex items-center justify-center z-50 px-4"
    @click.self="$emit('close')"
  >


    <div class="max-w-3xl w-full bg-zinc-900 text-light rounded-2xl overflow-hidden shadow-2xl">
                <!-- En haut à droite de la modale -->
        <button
        @click="$emit('close')"
        class="absolute top-4 right-4 bg-black bg-opacity-50 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-opacity-80 transition z-50"
        >
        ✕
        </button>
      <!-- Image -->
      <div class="w-full h-[400px] bg-zinc-800 flex items-center justify-center overflow-hidden">
        <img
          :src="event.image_url"
          alt="Visuel"
          class="object-contain h-full w-full rounded-t-2xl"
        />
      </div>

      <!-- Contenu -->
      <div class="p-6 space-y-4">
        <h2 class="text-3xl font-heading">{{ event.nom }}</h2>
        <p class="text-light/70 text-sm">
          📍 {{ event.lieu }} — {{ formatDate(event.date) }}
        </p>
        <p class="text-primary font-medium text-lg">À partir de {{ event.prix_debut }} €</p>
        <p v-if="event.description" class="text-base max-h-40 overflow-scroll mt-4">{{ event.description }}</p>

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
defineProps({
  event: Object
})

function formatDate(dateStr: string) {
  const d = new Date(dateStr)
  return d.toLocaleDateString()
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
