<template>
  <div class="pt-20 max-w-4xl mx-auto px-6 text-dark">
    <h1 class="text-4xl font-heading text-primary mb-8">Back Office</h1>

    <!-- Form add / edit -->
    <form @submit.prevent="saveEvent" class="space-y-4 mb-12">
      <input v-model="newEvent.date" type="date" class="w-full p-2 border rounded" required />
      <input v-model="newEvent.lieu" type="text" placeholder="Lieu" class="w-full p-2 border rounded" required />
      <input v-model="newEvent.image_url" type="url" placeholder="URL Image" class="w-full p-2 border rounded" />
      <input v-model="newEvent.billeterie_url" type="url" placeholder="URL Billetterie" class="w-full p-2 border rounded" />
      <input v-model="newEvent.insta_url" type="url" placeholder="URL Instagram" class="w-full p-2 border rounded" />
      <input v-model="newEvent.prix_debut" type="number" placeholder="Prix de départ (€)" class="w-full p-2 border rounded" />
      
      <div class="flex space-x-4">
        <button type="submit" class="bg-primary text-light px-6 py-2 rounded hover:bg-dark">
          {{ editing ? 'Mettre à jour' : 'Ajouter l\'événement' }}
        </button>
        <button type="button" @click="resetForm" v-if="editing" class="px-6 py-2 rounded border border-dark hover:bg-gray-100">
          Annuler
        </button>
      </div>
    </form>

    <!-- Liste des événements -->
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
  id: null,
  date: '',
  lieu: '',
  image_url: '',
  billeterie_url: '',
  insta_url: '',
  prix_debut: null
})

const editing = ref(false)
const events = ref<any[]>([])

async function fetchEvents() {
  const { data } = await supabase.from('evenements').select('*').order('date', { ascending: true })
  events.value = data || []
}

async function saveEvent() {
  if (editing.value) {
    // UPDATE
    const { error } = await supabase.from('evenements').update({
      date: newEvent.value.date,
      lieu: newEvent.value.lieu,
      image_url: newEvent.value.image_url,
      billeterie_url: newEvent.value.billeterie_url,
      insta_url: newEvent.value.insta_url,
      prix_debut: newEvent.value.prix_debut
    }).eq('id', newEvent.value.id)

    if (error) console.error('Update error:', error.message)
  } else {
    // INSERT
    const { error } = await supabase.from('evenements').insert([newEvent.value])
    if (error) console.error('Add error:', error.message)
  }

  await fetchEvents()
  resetForm()
}

async function deleteEvent(id: number) {
  const { error } = await supabase.from('evenements').delete().eq('id', id)
  if (error) console.error('Delete error:', error.message)
  await fetchEvents()
}

function editEvent(event: any) {
  newEvent.value = { ...event }
  editing.value = true
}

function resetForm() {
  newEvent.value = {
    id: null,
    date: '',
    lieu: '',
    image_url: '',
    billeterie_url: '',
    insta_url: '',
    prix_debut: null
  }
  editing.value = false
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr)
  return d.toLocaleDateString()
}

onMounted(fetchEvents)
</script>

