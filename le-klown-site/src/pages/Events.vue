<template>
  <div class="pt-20 px-4 text-light bg-dark mx-auto">
    <!-- À venir -->
    <h2 class="text-3xl font-heading text-primary mb-6 text-start">{{ $t('events.upcoming') }}</h2>
    <div class="grid justify-center gap-4 grid-cols-[repeat(auto-fit,_minmax(260px,_1fr))] mb-12">
      <EventCard
        v-for="event in upcomingEvents"
        :key="event.id"
        :event="event"
        @click="openModal(event)"
      />
    </div>

    <!-- Passés -->
    <h2 class="text-3xl font-heading text-primary mb-6 text-start">{{ $t('events.past') }}</h2>
    <div class="grid justify-center gap-4 grid-cols-[repeat(auto-fit,_minmax(260px,_1fr))]">
      <div
        v-for="event in pastEvents"
        :key="event.id"
        class="grayscale opacity-60 hover:opacity-90 transition"
      >
        <EventCard
          :event="event"
          @click="openModal(event)"
        />
      </div>
    </div>

    <!-- Modal -->
    <EventModal
      v-if="selectedEvent"
      :event="selectedEvent"
      @close="selectedEvent = null"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { supabase } from '../supabase/client'
import EventCard from '../components/EventCard.vue'
import EventModal from '../components/EventModal.vue'

const events = ref<any[]>([])
const selectedEvent = ref(null)

async function fetchEvents() {
  const { data, error } = await supabase
    .from('evenements')
    .select('*')
    .order('date', { ascending: true })

  if (!error) events.value = data
  else console.error(error)
}

const now = new Date()

const upcomingEvents = computed(() =>
  events.value.filter(e => new Date(e.date) >= now)
)

const pastEvents = computed(() =>
  events.value.filter(e => new Date(e.date) < now).reverse()
)

function openModal(event: any) {
  selectedEvent.value = event
}

onMounted(fetchEvents)
</script>
