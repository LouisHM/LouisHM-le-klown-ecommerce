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
  images: string[]
  billeterie_url: string | null
  insta_url: string | null
  description: string | null
  created_at?: string
}

function parseEventImages(raw: unknown): string[] {
  if (Array.isArray(raw)) return raw.map((value) => String(value).trim()).filter(Boolean)
  if (typeof raw === 'string') {
    const trimmed = raw.trim()
    if (!trimmed) return []
    try {
      const parsed = JSON.parse(trimmed)
      if (Array.isArray(parsed)) {
        return parsed.map((value) => String(value).trim()).filter(Boolean)
      }
    } catch {
      /* ignore */
    }
    return [trimmed]
  }
  if (raw) return [String(raw).trim()].filter(Boolean)
  return []
}

export function normalizeEventRow(row: any): EventRecord {
  const images = parseEventImages(row?.image_url)
  return {
    id: String(row.id),
    nom: row.nom ?? '',
    date: row.date ?? '',
    lieu: row.lieu ?? '',
    prix_debut: Number(row.prix_debut ?? 0),
    image_url: images[0] ?? null,
    images,
    billeterie_url: row.billeterie_url ?? null,
    insta_url: row.insta_url ?? null,
    description: row.description ?? null,
    created_at: row.created_at ?? undefined,
  }
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
      events.value = (data ?? []).map(normalizeEventRow)
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

    return { data: data ? normalizeEventRow(data) : null, error: err }
  }

  /** Add a new event */
  async function addEvent(input: Omit<EventRecord, 'id' | 'created_at' | 'images'>) {
    const { data, error: err } = await supabase
      .from('evenements')
      .insert([input])
      .select('*')
      .single()

    return { data: data ? normalizeEventRow(data) : null, error: err }
  }

  /** Update an existing event */
  async function updateEvent(id: string, updates: Partial<Omit<EventRecord, 'id' | 'images'>>) {
    const { data, error: err } = await supabase
      .from('evenements')
      .update(updates)
      .eq('id', id)
      .select('*')
      .single()

    return { data: data ? normalizeEventRow(data) : null, error: err }
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
