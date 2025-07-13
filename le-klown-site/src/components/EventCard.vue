<template>
  <div
    class="relative min-w-[220px] max-w-[220px] flex-shrink-0 overflow-hidden rounded-lg group cursor-pointer"
  >
    <!-- Image avec scale -->
    <img
      :src="event.image_url"
      alt="Image event"
      class="w-full h-36 object-cover transition-transform duration-500 group-hover:scale-110"
    />

    <!-- Overlay texte -->
    <div class="absolute bottom-0 left-0 w-full bg-black bg-opacity-60 text-light p-2">
      <h3 class="text-sm font-heading">{{ event.lieu }}</h3>
      <p class="text-xs">{{ formatDate(event.date) }} - Dès {{ event.prix_debut }}€</p>
    </div>

    <!-- Boutons admin -->
    <div
      v-if="editable"
      class="absolute top-2 right-2 flex space-x-1"
    >
      <button
        @click.stop="$emit('edit', event)"
        class="bg-accent text-light rounded px-2 py-1 text-xs hover:bg-light hover:text-dark"
      >
        ✏️
      </button>
      <button
        @click.stop="$emit('delete', event.id)"
        class="bg-red-600 text-light rounded px-2 py-1 text-xs hover:bg-light hover:text-dark"
      >
        🗑️
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  event: Object,
  editable: {
    type: Boolean,
    default: false
  }
})

function formatDate(dateStr: string) {
  const d = new Date(dateStr)
  return d.toLocaleDateString()
}
</script>
