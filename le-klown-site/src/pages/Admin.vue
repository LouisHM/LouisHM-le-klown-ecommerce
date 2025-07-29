<template>
  <div class="pt-24 px-4 md:px-10 min-h-screen bg-dark text-light space-y-12">
    <!-- ✅ Formulaire -->
    <section class="bg-[#1a1a1a] border border-gray-700 rounded-lg p-6 max-w-3xl mx-auto shadow-lg">
      <h2 class="text-2xl font-heading text-primary mb-6">Ajouter / Modifier un événement</h2>

      <form @submit.prevent="saveEvent" class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input v-model="newEvent.nom" type="text" placeholder="Nom de l’événement *" required class="form-input" />
          <input v-model="newEvent.date" type="date" required class="form-input" />
          <input v-model="newEvent.lieu" type="text" placeholder="Lieu *" required class="form-input" />
          <input v-model="newEvent.prix_debut" type="number" placeholder="Prix de départ (€) *" required class="form-input" />
          <input v-model="newEvent.image_url" type="url" placeholder="URL de l'image" class="form-input" />
          <input v-model="newEvent.billeterie_url" type="url" placeholder="Lien billetterie" class="form-input" />
          <input v-model="newEvent.insta_url" type="url" placeholder="Lien Instagram" class="form-input" />
        </div>
        <textarea v-model="newEvent.description" placeholder="Description (optionnel)" rows="4" class="form-textarea w-full" />

        <div class="flex space-x-4 mt-4">
          <button type="submit" class="bg-primary text-dark px-6 py-2 rounded hover:bg-light font-semibold">
            {{ editing ? 'Mettre à jour' : 'Ajouter' }}
          </button>
          <button v-if="editing" @click="resetForm" type="button" class="px-6 py-2 rounded border border-light hover:bg-gray-100">
            Annuler
          </button>
        </div>
      </form>
    </section>

    <!-- À venir -->
    <h2 class="text-3xl font-heading text-primary mb-6 text-start">{{ $t('events.upcoming') }}</h2>
    <div class="grid justify-center gap-4 grid-cols-[repeat(auto-fit,_minmax(260px,_1fr))] mb-12">
      <EventCard
        v-for="event in aVenir"
        :key="event.id"
        :event="event"
        :editable="true"
        @click="openModal(event)"
        @edit="editEvent"
        @delete="confirmDelete"
      />
    </div>

    <!-- Passés -->
    <h2 class="text-3xl font-heading text-primary mb-6 text-start">{{ $t('events.past') }}</h2>
    <div class="grid justify-center gap-4 grid-cols-[repeat(auto-fit,_minmax(260px,_1fr))]">
      <div
        v-for="event in passes"
        :key="event.id"
        class="grayscale opacity-60 hover:opacity-90 transition"
      >
        <EventCard
          :event="event"
          :editable="true"
          @click="openModal(event)"
          @edit="editEvent"
          @delete="confirmDelete"
        />
      </div>
    </div>

    <!-- ✅ Modal détails -->
    <EventModal
      v-if="selectedEvent"
      :event="selectedEvent"
      @close="selectedEvent = null"
    />

    <!-- ✅ Modal confirmation delete -->
    <div v-if="showConfirm" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-light text-dark p-6 rounded-lg shadow-lg space-y-4 w-[90%] max-w-md">
        <h2 class="text-2xl font-heading mb-4">Supprimer cet événement ?</h2>
        <p>Cette action est irréversible.</p>
        <div class="flex justify-end space-x-4 mt-6">
          <button @click="showConfirm = false" class="px-4 py-2 rounded border border-dark hover:bg-gray-200">Annuler</button>
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
import EventModal from '../components/EventModal.vue'

const newEvent = ref({
  id: null,
  nom: '',
  date: '',
  lieu: '',
  image_url: '',
  billeterie_url: '',
  insta_url: '',
  prix_debut: null,
  description: ''
})

const editing = ref(false)
const events = ref<any[]>([])
const aVenir = ref<any[]>([])
const passes = ref<any[]>([])
const showConfirm = ref(false)
const deleteId = ref<number | null>(null)
const selectedEvent = ref(null)

async function fetchEvents() {
  const { data } = await supabase.from('evenements').select('*').order('date', { ascending: true })
  events.value = data || []

  const today = new Date()
  aVenir.value = events.value.filter(e => new Date(e.date) >= today)
  passes.value = events.value.filter(e => new Date(e.date) < today)
}

function openModal(event: any) {
  selectedEvent.value = event
}

async function saveEvent() {
  if (editing.value) {
    const { error } = await supabase.from('evenements').update({
      nom: newEvent.value.nom,
      date: newEvent.value.date,
      lieu: newEvent.value.lieu,
      prix_debut: newEvent.value.prix_debut,
      image_url: newEvent.value.image_url,
      billeterie_url: newEvent.value.billeterie_url,
      insta_url: newEvent.value.insta_url,
      description: newEvent.value.description
    }).eq('id', newEvent.value.id)

    if (error) console.error('Update error:', error.message)
  } else {
    const { id, ...eventWithoutId } = newEvent.value
    const { error } = await supabase.from('evenements').insert([eventWithoutId])
    if (error) console.error('Insert error:', error.message)
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
    nom: '',
    date: '',
    lieu: '',
    image_url: '',
    billeterie_url: '',
    insta_url: '',
    prix_debut: null,
    description: ''
  }
  editing.value = false
}

onMounted(fetchEvents)
</script>
