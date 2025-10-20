<template>
  <div class="pt-24 max-w-7xl flex flex-col align-center justify-center px-4 text-light bg-dark mx-auto">
    <!-- À venir -->
    <h2 class="text-3xl font-heading text-light uppercase mb-6 text-start">{{ $t('events.upcoming') }}</h2>
    <ul class="flex justify-center md:justify-start flex-wrap gap-4 mb-12">
      <EventCard
        v-for="event in upcomingEvents"
        :key="event.id"
        :event="event"
        @click="openModal(event)"
      />
    </ul>

    <!-- Passés -->
    <h2 class="text-3xl font-heading text-light uppercase mb-6 text-start">{{ $t('events.past') }}</h2>
    <div class="flex justify-center md:justify-start flex-wrap gap-4">
      <ul
        v-for="event in pastEvents"
        :key="event.id"
        class="opacity-60 hover:opacity-90 transition"
      >
        <EventCard
          :event="event"
          @click="openModal(event)"
        />
        </ul>
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
import EventCard from '@/components/EventCard.vue'
import EventModal from '@/components/EventModal.vue'
import { normalizeEventRow, type EventRecord } from '@/composables/useEvents'
import { supabase } from '@/supabase/client'

const events = ref<EventRecord[]>([])
const selectedEvent = ref<EventRecord | null>(null)

async function fetchEvents() {
  const { data, error } = await supabase
    .from('evenements')
    .select('*')
    .order('date', { ascending: true })

  if (error) {
    console.error(error)
    events.value = []
  } else {
    events.value = (data ?? []).map(normalizeEventRow)
  }
}

const now = new Date()

const upcomingEvents = computed(() =>
  events.value.filter(e => new Date(e.date).getTime() >= now.getTime())
)

const pastEvents = computed(() =>
  events.value.filter(e => new Date(e.date).getTime() < now.getTime()).reverse()
)

function openModal(event: EventRecord) {
  selectedEvent.value = event
}

onMounted(fetchEvents)
</script>
