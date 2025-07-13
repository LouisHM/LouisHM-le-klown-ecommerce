<template>
  <div class="min-h-screen bg-black flex pt-20">

    <!-- Form à gauche -->
    <div class="w-full md:w-1/2 p-8 text-light">
      <h1 class="text-4xl font-heading text-primary mb-8">Back Office</h1>

      <form @submit.prevent="saveEvent" class="space-y-4">
        <input v-model="newEvent.date" type="date" class="w-full p-2 border border-gray-600 bg-dark text-light rounded" required />
        <input v-model="newEvent.lieu" type="text" placeholder="Lieu" class="w-full p-2 border border-gray-600 bg-dark text-light rounded" required />
        <input v-model="newEvent.image_url" type="url" placeholder="URL Image" class="w-full p-2 border border-gray-600 bg-dark text-light rounded" />
        <input v-model="newEvent.billeterie_url" type="url" placeholder="URL Billetterie" class="w-full p-2 border border-gray-600 bg-dark text-light rounded" />
        <input v-model="newEvent.insta_url" type="url" placeholder="URL Instagram" class="w-full p-2 border border-gray-600 bg-dark text-light rounded" />
        <input v-model="newEvent.prix_debut" type="number" placeholder="Prix de départ (€)" class="w-full p-2 border border-gray-600 bg-dark text-light rounded" />

        <div class="flex space-x-4">
          <button type="submit" class="bg-primary text-dark px-6 py-2 rounded hover:bg-light">
            {{ editing ? 'Mettre à jour' : 'Ajouter' }}
          </button>
          <button type="button" @click="resetForm" v-if="editing" class="px-6 py-2 rounded border border-light hover:bg-gray-800">
            Annuler
          </button>
        </div>
      </form>
    </div>

    <!-- Liste à droite -->
<div class="w-full md:w-1/2 p-8 text-light space-y-12 overflow-x-auto">

  <div v-if="aVenir.length">
    <h2 class="text-2xl font-heading text-primary mb-4">À venir</h2>
    <div class="flex space-x-4 overflow-x-auto pb-4">
      <EventCard
        v-for="event in aVenir"
        :key="event.id"
        :event="event"
        :editable="true"
        @edit="editEvent"
        @delete="confirmDelete"
      />
    </div>
  </div>

  <div v-if="passes.length">
    <h2 class="text-2xl font-heading text-primary mb-4">Passés</h2>
    <div class="flex space-x-4 overflow-x-auto opacity-60 pb-4">
      <EventCard
        v-for="event in passes"
        :key="event.id"
        :event="event"
        :editable="true"
        @edit="editEvent"
        @delete="confirmDelete"
      />
    </div>
  </div>

</div>

    <!-- Modal -->
    <div v-if="showConfirm" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-dark text-light p-6 rounded-lg shadow-lg space-y-4 w-[90%] max-w-md border border-gray-700">
        <h2 class="text-2xl font-heading mb-4">Supprimer cet événement ?</h2>
        <p>Cette action est irréversible.</p>
        <div class="flex justify-end space-x-4 mt-6">
          <button @click="showConfirm = false" class="px-4 py-2 rounded border border-light hover:bg-gray-700">Annuler</button>
          <button @click="deleteEvent" class="px-4 py-2 rounded bg-red-600 text-light hover:bg-dark">Confirmer</button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { supabase } from '../supabase/client'
import EventCard from '../components/EventCard.vue'

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
const aVenir = ref<any[]>([])
const passes = ref<any[]>([])
const showConfirm = ref(false)
const deleteId = ref<number | null>(null)

async function fetchEvents() {
  const { data } = await supabase.from('evenements').select('*').order('date', { ascending: true })
  events.value = data || []

  const today = new Date()
  aVenir.value = events.value.filter(e => new Date(e.date) >= today)
  passes.value = events.value.filter(e => new Date(e.date) < today)
}

async function saveEvent() {
  if (editing.value) {
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
    const { id, ...eventWithoutId } = newEvent.value
    const { error } = await supabase.from('evenements').insert([eventWithoutId])
    if (error) console.error('Add error:', error.message)
  }
  await fetchEvents()
  resetForm()
}

function confirmDelete(id: number) {
  deleteId.value = id
  showConfirm.value = true
}

async function deleteEvent() {
  if (deleteId.value !== null) {
    const { error } = await supabase.from('evenements').delete().eq('id', deleteId.value)
    if (error) console.error('Delete error:', error.message)
    await fetchEvents()
  }
  showConfirm.value = false
  deleteId.value = null
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

onMounted(fetchEvents)
</script>
