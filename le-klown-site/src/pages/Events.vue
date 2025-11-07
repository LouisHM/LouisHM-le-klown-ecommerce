<template>
  <div class="pt-24 max-w-7xl flex flex-col align-center justify-center px-4 text-light bg-dark mx-auto">
    <!-- À venir -->
    <section class="mb-12">
      <h2 class="text-3xl font-heading text-light uppercase mb-6 text-start">{{ $t('events.upcoming') }}</h2>
      <div v-if="upcomingLoading && !upcomingEvents.length" class="text-sm opacity-70">
        {{ $t('common.loading') || 'Chargement…' }}
      </div>
      <p v-else-if="!upcomingEvents.length" class="text-sm opacity-70">
        {{ $t('events.noUpcoming') || 'Aucun évènement à venir pour le moment.' }}
      </p>
      <ul
        v-else
        class="flex justify-center md:justify-start flex-wrap gap-4"
      >
        <EventCard
          v-for="event in upcomingEvents"
          :key="event.id"
          :event="event"
          @click="openModal(event)"
        />
      </ul>
      <div
        v-if="upcomingHasMore"
        class="mt-6 flex justify-center"
      >
        <button
          class="px-5 py-2 rounded-full border border-light/40 text-sm font-semibold hover:bg-light hover:text-dark transition disabled:opacity-60 disabled:cursor-not-allowed"
          :disabled="upcomingLoading"
          @click="loadMoreUpcoming"
        >
          {{ upcomingLoading ? ($t('common.loading') || 'Chargement…') : ($t('events.loadMore') || 'Voir plus') }}
        </button>
      </div>
    </section>

    <!-- Passés -->
    <section>
      <h2 class="text-3xl font-heading text-light uppercase mb-6 text-start">{{ $t('events.past') }}</h2>
      <div v-if="pastLoading && !pastEvents.length" class="text-sm opacity-70">
        {{ $t('common.loading') || 'Chargement…' }}
      </div>
      <p v-else-if="!pastEvents.length" class="text-sm opacity-70">
        {{ $t('events.noPast') || 'Pas encore d\'évènements passés.' }}
      </p>
      <div
        v-else
        class="flex justify-center md:justify-start flex-wrap gap-4"
      >
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
      <div
        v-if="pastHasMore"
        class="mt-6 flex justify-center"
      >
        <button
          class="px-5 py-2 rounded-full border border-light/40 text-sm font-semibold hover:bg-light hover:text-dark transition disabled:opacity-60 disabled:cursor-not-allowed"
          :disabled="pastLoading"
          @click="loadMorePast"
        >
          {{ pastLoading ? ($t('common.loading') || 'Chargement…') : ($t('events.loadMore') || 'Voir plus') }}
        </button>
      </div>
    </section>

    <!-- Modal -->
    <EventModal
      v-if="selectedEvent"
      :event="selectedEvent"
      @close="selectedEvent = null"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import EventCard from '@/components/EventCard.vue'
import EventModal from '@/components/EventModal.vue'
import type { EventRecord } from '@/composables/useEvents'
import { useEvents } from '@/composables/useEvents'

const { fetchUpcomingPage, fetchPastPage } = useEvents()

const UPCOMING_LIMIT = 10
const PAST_LIMIT = 10

const upcomingEvents = ref<EventRecord[]>([])
const pastEvents = ref<EventRecord[]>([])
const selectedEvent = ref<EventRecord | null>(null)
const upcomingHasMore = ref(true)
const pastHasMore = ref(false)
const upcomingLoading = ref(false)
const pastLoading = ref(false)
const currentNowIso = ref(new Date().toISOString())

function dedupeAndAppend(target: EventRecord[], incoming: EventRecord[], reset: boolean) {
  if (reset) {
    target.splice(0, target.length, ...incoming)
    return
  }
  const existingIds = new Set(target.map((item) => item.id))
  const merged = [...target]
  for (const event of incoming) {
    if (!existingIds.has(event.id)) {
      merged.push(event)
      existingIds.add(event.id)
    }
  }
  target.splice(0, target.length, ...merged)
}

async function loadUpcoming({ reset = false, nowIso }: { reset?: boolean; nowIso?: string } = {}) {
  if (upcomingLoading.value) return
  upcomingLoading.value = true
  const offset = reset ? 0 : upcomingEvents.value.length
  const force = reset && !upcomingEvents.value.length
  const { data, hasMore, error } = await fetchUpcomingPage({
    limit: UPCOMING_LIMIT,
    offset,
    force,
    nowIso: nowIso ?? currentNowIso.value,
  })
  if (error) {
    console.error('[Events] unable to load upcoming events', error)
  } else {
    dedupeAndAppend(upcomingEvents.value, data, reset)
    upcomingHasMore.value = hasMore
  }
  upcomingLoading.value = false
}

async function loadPast({ reset = false, nowIso }: { reset?: boolean; nowIso?: string } = {}) {
  if (pastLoading.value) return
  pastLoading.value = true
  const offset = reset ? 0 : pastEvents.value.length
  const force = reset && !pastEvents.value.length
  const { data, hasMore, error } = await fetchPastPage({
    limit: PAST_LIMIT,
    offset,
    force,
    nowIso: nowIso ?? currentNowIso.value,
  })
  if (error) {
    console.error('[Events] unable to load past events', error)
  } else {
    dedupeAndAppend(pastEvents.value, data, reset)
    pastHasMore.value = hasMore
  }
  pastLoading.value = false
}

async function refreshEvents() {
  const nowIso = new Date().toISOString()
  currentNowIso.value = nowIso
  await Promise.all([
    loadUpcoming({ reset: true, nowIso }),
    loadPast({ reset: true, nowIso }),
  ])
}

async function loadMoreUpcoming() {
  await loadUpcoming()
}

async function loadMorePast() {
  await loadPast()
}

function openModal(event: EventRecord) {
  selectedEvent.value = event
}

function handleVisibilityChange() {
  if (document.visibilityState === 'visible') {
    void refreshEvents()
  }
}

function handlePageShow(event: PageTransitionEvent) {
  if (event.persisted) {
    void refreshEvents()
  }
}

onMounted(() => {
  void refreshEvents()
  document.addEventListener('visibilitychange', handleVisibilityChange)
  if (typeof window !== 'undefined') {
    window.addEventListener('pageshow', handlePageShow)
  }
})

onBeforeUnmount(() => {
  document.removeEventListener('visibilitychange', handleVisibilityChange)
  if (typeof window !== 'undefined') {
    window.removeEventListener('pageshow', handlePageShow)
  }
})
</script>
