// src/composables/useEvents.ts
import { ref } from 'vue'
import type { PostgrestError } from '@supabase/supabase-js'
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

interface EventCacheBucket {
  items: EventRecord[]
  total: number | null
  expiresAt: number
}

interface FetchPageOptions {
  limit: number
  offset?: number
  force?: boolean
  nowIso?: string
}

interface FetchPageResult {
  data: EventRecord[]
  total: number | null
  hasMore: boolean
  fromCache: boolean
  error: PostgrestError | null
}

const EVENT_SELECT_FIELDS = 'id,nom,date,lieu,prix_debut,image_url,billeterie_url,insta_url,description,created_at'
const CACHE_TTL_MS = 1000 * 60 * 5

const upcomingCache: EventCacheBucket = { items: [], total: null, expiresAt: 0 }
const pastCache: EventCacheBucket = { items: [], total: null, expiresAt: 0 }

function isCacheFresh(bucket: EventCacheBucket) {
  return Date.now() < bucket.expiresAt
}

function touchCache(bucket: EventCacheBucket) {
  bucket.expiresAt = Date.now() + CACHE_TTL_MS
}

function resetBucket(bucket: EventCacheBucket) {
  bucket.items = []
  bucket.total = null
  bucket.expiresAt = 0
}

export function invalidateEventCaches() {
  resetBucket(upcomingCache)
  resetBucket(pastCache)
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
  async function fetchEventPage(
    kind: 'upcoming' | 'past',
    { limit, offset = 0, force = false, nowIso }: FetchPageOptions,
  ): Promise<FetchPageResult> {
    const bucket = kind === 'upcoming' ? upcomingCache : pastCache
    const cacheValid = isCacheFresh(bucket) && !force

    if (cacheValid && bucket.items.length >= offset + limit) {
      const slice = bucket.items.slice(offset, offset + limit)
      const total = bucket.total
      const hasMore =
        total != null ? offset + slice.length < total : slice.length === limit
      return {
        data: slice,
        total,
        hasMore,
        fromCache: true,
        error: null,
      }
    }

    if (force || !cacheValid || offset === 0) {
      // Reset cache when forcing or refreshing head of list.
      bucket.items = offset === 0 || force ? [] : bucket.items
      bucket.total = offset === 0 || force ? null : bucket.total
    }

    const nowValue = nowIso ?? new Date().toISOString()
    const from = offset
    const to = offset + Math.max(0, limit - 1)
    let query = supabase
      .from('evenements')
      .select(EVENT_SELECT_FIELDS, { count: 'exact' })

    if (kind === 'upcoming') {
      query = query.gte('date', nowValue).order('date', { ascending: true })
    } else {
      query = query.lt('date', nowValue).order('date', { ascending: false })
    }

    query = query.range(from, to)

    const { data, error, count } = await query

    if (error) {
      return {
        data: [],
        total: bucket.total,
        hasMore: false,
        fromCache: false,
        error,
      }
    }

    const mapped = (data ?? []).map(normalizeEventRow)
    const total = count ?? bucket.total ?? null

    if (mapped.length) {
      // Ensure array has enough space and write in place.
      const before = bucket.items.slice(0, offset)
      const after =
        bucket.items.length > offset + mapped.length
          ? bucket.items.slice(offset + mapped.length)
          : []
      bucket.items = [...before, ...mapped, ...after]
    } else if (offset === 0) {
      bucket.items = []
    }

    bucket.total = total
    touchCache(bucket)

    const hasMore =
      total != null
        ? offset + mapped.length < total
        : mapped.length === limit

    return {
      data: mapped,
      total,
      hasMore,
      fromCache: false,
      error: null,
    }
  }

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
    fetchUpcomingPage: (options: FetchPageOptions) =>
      fetchEventPage('upcoming', options),
    fetchPastPage: (options: FetchPageOptions) =>
      fetchEventPage('past', options),
    fetchEvents,
    fetchEvent,
    addEvent,
    updateEvent,
    deleteEvent,
    invalidateEventCaches,
  }
}
