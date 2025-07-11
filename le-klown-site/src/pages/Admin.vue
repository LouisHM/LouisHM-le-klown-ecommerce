<template>
  <div class="pt-20 max-w-4xl mx-auto px-6 text-dark">
    <h1 class="text-4xl font-heading text-primary mb-8">Back Office</h1>

    <!-- Formulaire ajout event -->
    <form @submit.prevent="addEvent" class="space-y-4 mb-12">
      <input v-model="newEvent.date" type="date" class="w-full p-2 border rounded" required />
      <input v-model="newEvent.lieu" type="text" placeholder="Lieu" class="w-full p-2 border rounded" required />
      <input v-model="newEvent.image_url" type="url" placeholder="URL Image" class="w-full p-2 border rounded" />
      <input v-model="newEvent.billeterie_url" type="url" placeholder="URL Billetterie" class="w-full p-2 border rounded" />
      <input v-model="newEvent.insta_url" type="url" placeholder="URL Instagram" class="w-full p-2 border rounded" />
      <input v-model="newEvent.prix_debut" type="number" placeholder="Prix de départ (€)" class="w-full p-2 border rounded" />
      <button type="submit" class="bg-primary text-light px-6 py-2 rounded hover:bg-dark">Ajouter l'événement</button>
    </form>

    <!-- Liste des events existants -->
    <div v-if="events.length" class="space-y-6">
      <div v-for="event in events" :key="event.id" class="p-4 border rounded flex justify-between items-center">
        <div>
          <h3 class="text-xl font-heading">{{ event.lieu }} - {{ formatDate(event.date) }}</h3>
          <p class="text-sm">À partir de {{ event.prix_debut }}€</p>
        </div>
        <div class="space-x-2">
          <button @click="editEvent(event)" class="px-3 py-1 bg-accent text-light rounded hover:bg-light hover:text-dark">✏️ Edit</button>
          <button @click="deleteEvent(event.id)" class="px-3 py-1 bg-red-600 text-light rounded hover:bg-light hover:text-dark">🗑️ Delete</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { supabase } from '../supabase/client'

const newEvent = ref({
  date: '',
  lieu: '',
  image_url: '',
  billeterie_url: '',
  insta_url: '',
  prix_debut: null
})

const events = ref<any[]>([])

async function fetchEvents() {
  const { data } = await supabase.from('evenements').select('*').order('date', { ascending: true })
  events.value = data || []
}

async function addEvent() {
  const { error } = await supabase.from('evenements').insert([newEvent.value])
  if (error) {
    console.error('Add event error:', error.message)
  } else {
    await fetchEvents()
    newEvent.value = { date: '', lieu: '', image_url: '', billeterie_url: '', insta_url: '', prix_debut: null }
  }
}

async function deleteEvent(id: number) {
  const { error } = await supabase.from('evenements').delete().eq('id', id)
  if (error) {
    console.error('Delete error:', error.message)
  } else {
    await fetchEvents()
  }
}

function editEvent(event: any) {
  newEvent.value = { ...event }
  deleteEvent(event.id) // simple simulate "update" by re-adding (sinon tu fais update direct)
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr)
  return d.toLocaleDateString()
}

onMounted(fetchEvents)
</script>
