// src/composables/useEvents.ts
import { ref } from 'vue'
import { supabase } from '@/supabase/client' // use alias

export interface EventRecord {
  id: string
  nom: string
  date: string
  lieu: string
  prix_debut: number
  image_url: string | null
  billeterie_url: string | null
  insta_url: string | null
  description: string | null
  created_at?: string
}

export function useEvents() {
  const events = ref<EventRecord[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  /** Fetch all events, ordered by date ascending */
  async function fetchEvents() {
    loading.value = true
    error.value = null

    const { data, error: err } = await supabase
      .from('evenements')
      .select('*')
      .order('date', { ascending: true })

    if (err) {
      error.value = err.message
      events.value = []
    } else {
      events.value = (data ?? []) as unknown as EventRecord[]
    }

    loading.value = false
    return { data: events.value, error: err }
  }

  /** Fetch a single event by ID */
  async function fetchEvent(id: string) {
    const { data, error: err } = await supabase
      .from('evenements')
      .select('*')
      .eq('id', id)
      .single()

    return { data: (data ?? null) as unknown as EventRecord | null, error: err }
  }

  /** Add a new event */
  async function addEvent(input: Omit<EventRecord, 'id' | 'created_at'>) {
    const { data, error: err } = await supabase
      .from('evenements')
      .insert([input])
      .select('*')
      .single()

    return { data: (data ?? null) as unknown as EventRecord | null, error: err }
  }

  /** Update an existing event */
  async function updateEvent(id: string, updates: Partial<Omit<EventRecord, 'id'>>) {
    const { data, error: err } = await supabase
      .from('evenements')
      .update(updates)
      .eq('id', id)
      .select('*')
      .single()

    return { data: (data ?? null) as unknown as EventRecord | null, error: err }
  }

  /** Delete an event */
  async function deleteEvent(id: string) {
    const { data, error: err } = await supabase
      .from('evenements')
      .delete()
      .eq('id', id)
      .select('*')
      .single()

    return { data: (data ?? null) as unknown as EventRecord | null, error: err }
  }

  return {
    events,
    loading,
    error,
    fetchEvents,
    fetchEvent,
    addEvent,
    updateEvent,
    deleteEvent,
  }
}
