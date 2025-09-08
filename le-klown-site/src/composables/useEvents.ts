// src/composables/useEvents.ts
import { ref } from 'vue'
import { supabase } from '../supabase/client'

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
      .from<EventRecord>('evenements')
      .select('*')
      .order('date', { ascending: true })
    if (err) {
      error.value = err.message
      events.value = []
    } else {
      events.value = data ?? []
    }
    loading.value = false
    return { data, error: err }
  }

  /** Fetch a single event by ID */
  async function fetchEvent(id: string) {
    const { data, error: err } = await supabase
      .from<EventRecord>('evenements')
      .select('*')
      .eq('id', id)
      .single()
    return { data, error: err }
  }

  /** Add a new event */
  async function addEvent(input: Omit<EventRecord, 'id' | 'created_at'>) {
    const { data, error: err } = await supabase
      .from<EventRecord>('evenements')
      .insert([input])
    return { data, error: err }
  }

  /** Update an existing event */
  async function updateEvent(id: string, updates: Partial<Omit<EventRecord, 'id'>>) {
    const { data, error: err } = await supabase
      .from<EventRecord>('evenements')
      .update(updates)
      .eq('id', id)
    return { data, error: err }
  }

  /** Delete an event */
  async function deleteEvent(id: string) {
    const { data, error: err } = await supabase
      .from<EventRecord>('evenements')
      .delete()
      .eq('id', id)
    return { data, error: err }
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
