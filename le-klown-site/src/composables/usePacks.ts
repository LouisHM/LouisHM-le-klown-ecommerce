import { ref } from 'vue'
import { supabase } from '@/supabase/client'
import type { Product } from './useProducts'
import { mapProduct, humanizeErr } from './useProducts'

export interface PackItem {
  id: string
  packId: string
  productId: string
  quantity: number
  sortOrder: number
  product?: Product | null
}

export interface Pack {
  id: string
  name: string
  description: string | null
  price: number
  images: string[]
  deleted: boolean
  createdAt: string
  updatedAt: string
  items: PackItem[]
}

export interface PackDraft {
  id?: string
  name: string
  description: string | null
  price: number
  images: string[]
  deleted?: boolean
  items: Array<{
    id?: string
    productId: string
    quantity: number
    sortOrder: number
  }>
}

const TABLE = 'packs'
const ITEMS = 'pack_items'
const isDev = import.meta.env.DEV

function debugLog(...args: any[]) {
  if (isDev) console.debug(...args)
}

export function usePacks() {
  const packs = ref<Pack[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchPacks(includeDeleted = false) {
    loading.value = true
    error.value = null

    let query = supabase
      .from(TABLE)
      .select('*, pack_items(id, product_id, quantity, sort_order, products(*, product_stocks(*)))')
      .order('created_at', { ascending: true })

    if (!includeDeleted) query = query.eq('deleted', false)

    const { data, error: err } = await query

    if (err) {
      error.value = humanizeErr(err)
      packs.value = []
    } else {
      packs.value = Array.isArray(data) ? data.map(mapPack) : []
    }

    loading.value = false
    return { data: packs.value, error: err }
  }

  async function fetchPack(id: string) {
    const { data, error: err } = await supabase
      .from(TABLE)
      .select('*, pack_items(id, product_id, quantity, sort_order, products(*, product_stocks(*)))')
      .eq('id', id)
      .single()

    return { data: data ? mapPack(data) : null, error: err }
  }

  async function addPack(input: PackDraft) {
    const payload = buildPackPayload(input)
    debugLog('[usePacks] addPack payload', payload)

    const { data, error: insertError } = await supabase
      .from(TABLE)
      .insert(payload)
      .select('*')
      .single()

    if (insertError) {
      debugLog('[usePacks] addPack error', insertError)
      return { data: null, error: insertError }
    }

    const packId = data?.id
    if (!packId) {
      return { data: null, error: new Error('Insertion du pack impossible (ID manquant).') }
    }

    const sync = await replacePackItems(packId, input.items)
    if (sync.error) {
      debugLog('[usePacks] addPack items sync error', { packId, error: sync.error })
      return { data: null, error: sync.error }
    }
    debugLog('[usePacks] addPack success', { packId })

    return fetchPack(packId)
  }

  async function updatePack(id: string, input: PackDraft) {
    const payload = buildPackPayload(input)
    debugLog('[usePacks] updatePack payload', { id, payload })

    const { error: updateError } = await supabase
      .from(TABLE)
      .update(payload)
      .eq('id', id)

    if (updateError) {
      debugLog('[usePacks] updatePack error', { id, updateError })
      return { data: null, error: updateError }
    }

    const sync = await replacePackItems(id, input.items)
    if (sync.error) {
      debugLog('[usePacks] updatePack items sync error', { id, error: sync.error })
      return { data: null, error: sync.error }
    }
    debugLog('[usePacks] updatePack success', { id })

    return fetchPack(id)
  }

  async function deletePack(id: string) {
    const { error: err } = await supabase
      .from(TABLE)
      .update({ deleted: true })
      .eq('id', id)

    return { error: err }
  }

  return {
    packs,
    loading,
    error,
    fetchPacks,
    fetchPack,
    addPack,
    updatePack,
    deletePack,
  }
}

function buildPackPayload(input: PackDraft) {
  return {
    name: input.name,
    description: input.description,
    price: Number(input.price) || 0,
    images: sanitizeStringArray(input.images),
    deleted: !!input.deleted,
  }
}

async function replacePackItems(packId: string, items: PackDraft['items']) {
  const sanitized = Array.isArray(items)
    ? items
        .filter((item) => item && item.productId)
        .map((item, index) => ({
          pack_id: packId,
          product_id: item.productId,
          quantity: Math.max(1, Number(item.quantity) || 1),
          sort_order: Number(item.sortOrder ?? index),
        }))
    : []
  debugLog('[usePacks] replacePackItems sanitized', { packId, rows: sanitized })

  const { error: deleteError } = await supabase
    .from(ITEMS)
    .delete()
    .eq('pack_id', packId)

  if (deleteError) {
    debugLog('[usePacks] replacePackItems delete error', { packId, deleteError })
    return { error: deleteError }
  }

  if (sanitized.length === 0) return { error: null }

  const { error: insertError } = await supabase
    .from(ITEMS)
    .insert(sanitized)

  if (insertError) {
    debugLog('[usePacks] replacePackItems insert error', { packId, insertError })
  } else {
    debugLog('[usePacks] replacePackItems insert success', { packId, inserted: sanitized.length })
  }

  return { error: insertError ?? null }
}

function mapPack(row: any): Pack {
  const nestedItems = Array.isArray(row?.pack_items) ? row.pack_items : []
  const items: PackItem[] = nestedItems.map((item: any) => ({
    id: String(item.id),
    packId: String(row.id),
    productId: String(item.product_id),
    quantity: Number(item.quantity ?? 1),
    sortOrder: Number(item.sort_order ?? 0),
    product: item.products ? mapProduct(item.products) : null,
  }))

  items.sort((a, b) => a.sortOrder - b.sortOrder)

  return {
    id: String(row.id),
    name: row.name ?? '',
    description: row.description ?? null,
    price: Number(row.price ?? 0),
    images: sanitizeStringArray(row.images),
    deleted: !!row.deleted,
    createdAt: row.created_at ?? '',
    updatedAt: row.updated_at ?? row.created_at ?? '',
    items,
  }
}

function sanitizeStringArray(value: any): string[] {
  if (!Array.isArray(value)) {
    if (typeof value === 'string') return [value.trim()].filter(Boolean)
    return []
  }
  return value
    .map((item) => String(item ?? '').trim())
    .filter((item) => item.length > 0)
}
