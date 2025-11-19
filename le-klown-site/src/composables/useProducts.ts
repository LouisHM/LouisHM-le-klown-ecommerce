import { ref } from 'vue'
import { supabase } from '@/supabase/client'
import { prefetchImages } from '@/utils/imageCache'

export interface ProductStockEntry {
  id: string
  productId: string
  size: string | null
  color: string | null
  stock: number
}

export interface Product {
  id: string
  name: string
  description: string | null
  price: number
  images: string[]
  deleted: boolean
  createdAt: string
  updatedAt: string
  sizeOptions: string[]
  colorOptions: string[]
  stocks: ProductStockEntry[]
  totalStock: number
}

export interface ProductDraft {
  id?: string
  name: string
  description: string | null
  price: number
  images: string[]
  sizeOptions: string[]
  colorOptions: string[]
  stocks: Array<{
    id?: string
    size: string | null
    color: string | null
    stock: number
  }>
  deleted?: boolean
}

const TABLE = 'products'
const STOCK_TABLE = 'product_stocks'
const isDev = import.meta.env.DEV

function debugLog(...args: any[]) {
  if (isDev) console.debug(...args)
}

async function debugAuthState(context: string) {
  if (!isDev) return
  try {
    const { data } = await supabase.auth.getSession()
    const user = data?.session?.user ?? null
    debugLog('[useProducts] auth state', context, {
      userId: user?.id ?? null,
      email: user?.email ?? null,
      aud: user?.aud ?? null,
      appMetadata: user?.app_metadata ?? null,
    })
  } catch (err) {
    debugLog('[useProducts] auth state error', context, err)
  }
}

export function useProducts() {
  const products = ref<Product[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchProducts(includeDeleted = false) {
    loading.value = true
    error.value = null

    let query = supabase
      .from(TABLE)
      .select('*, product_stocks(*)')
      .order('created_at', { ascending: true })

    if (!includeDeleted) query = query.eq('deleted', false)

    const { data, error: err } = await query

    if (err) {
      error.value = humanizeErr(err)
      products.value = []
    } else {
      products.value = Array.isArray(data) ? data.map(mapProduct) : []
      void prefetchImages(products.value.flatMap((product) => product.images))
    }

    loading.value = false
    return { data: products.value, error: err }
  }

  async function fetchProduct(id: string) {
    const { data, error: err } = await supabase
      .from(TABLE)
      .select('*, product_stocks(*)')
      .eq('id', id)
      .single()

    const mapped = data ? mapProduct(data) : null
    if (mapped) void prefetchImages(mapped.images)

    return {
      data: mapped,
      error: err,
    }
  }

  async function addProduct(input: ProductDraft) {
    const payload = buildProductPayload(input)
    debugLog('[useProducts] addProduct payload', payload)

    const { data, error: insertError } = await supabase
      .from(TABLE)
      .insert(payload)
      .select('*, product_stocks(*)')
      .single()

    if (insertError) {
      debugLog('[useProducts] addProduct error', insertError)
      await debugAuthState('addProduct')
      return { data: null, error: insertError }
    }

    const productId = data?.id
    if (!productId) {
      return { data: null, error: new Error('Insertion du produit impossible (ID manquant).') }
    }

    const stockResult = await replaceProductStocks(productId, input.stocks)
    if (stockResult.error) return { data: null, error: stockResult.error }
    debugLog('[useProducts] addProduct stock sync success', { productId })

    return fetchProduct(productId)
  }

  async function updateProduct(id: string, input: ProductDraft) {
    const payload = buildProductPayload(input)
    debugLog('[useProducts] updateProduct payload', { id, payload })

    const { error: updateError } = await supabase
      .from(TABLE)
      .update(payload)
      .eq('id', id)

    if (updateError) {
      debugLog('[useProducts] updateProduct error', { id, updateError })
      await debugAuthState('updateProduct')
      return { data: null, error: updateError }
    }

    const stockResult = await replaceProductStocks(id, input.stocks)
    if (stockResult.error) {
      debugLog('[useProducts] updateProduct stock sync error', { id, error: stockResult.error })
      return { data: null, error: stockResult.error }
    }
    debugLog('[useProducts] updateProduct stock sync success', { id })

    return fetchProduct(id)
  }

  async function deleteProduct(id: string) {
    const { error: err } = await supabase
      .from(TABLE)
      .update({ deleted: true })
      .eq('id', id)

    return { error: err }
  }

  return {
    products,
    loading,
    error,
    fetchProducts,
    fetchProduct,
    addProduct,
    updateProduct,
    deleteProduct,
    mapProduct,
  }
}

function buildProductPayload(input: ProductDraft) {
  const images = sanitizeStringArray(input.images)
  const sizeOptions = dedupeStrings(input.sizeOptions)
  const colorOptions = dedupeStrings(input.colorOptions)
  const stocks = sanitizeStocks(input.stocks)
  let totalStock = 0
  for (const entry of stocks) {
    totalStock += Math.max(0, Number(entry.stock) || 0)
  }

  return {
    name: input.name,
    description: input.description,
    price: Number(input.price) || 0,
    images,
    deleted: !!input.deleted,
    size_options: sizeOptions,
    color_options: colorOptions,
    stock: totalStock,
  }
}

async function replaceProductStocks(productId: string, rows: ProductDraft['stocks']) {
  const sanitized = sanitizeStocks(rows).map((row) => ({
    product_id: productId,
    size: row.size ?? null,
    color: row.color ?? null,
    stock: Number(row.stock) || 0,
  }))
  debugLog('[useProducts] replaceProductStocks sanitized', { productId, rows: sanitized })

  const { error: deleteError } = await supabase
    .from(STOCK_TABLE)
    .delete()
    .eq('product_id', productId)

  if (deleteError) {
    debugLog('[useProducts] replaceProductStocks delete error', { productId, deleteError })
    return { error: deleteError }
  }

  if (sanitized.length === 0) return { error: null }

  const { error: insertError } = await supabase
    .from(STOCK_TABLE)
    .insert(sanitized)

  if (insertError) {
    debugLog('[useProducts] replaceProductStocks insert error', { productId, insertError })
  } else {
    debugLog('[useProducts] replaceProductStocks insert success', { productId, inserted: sanitized.length })
  }

  return { error: insertError ?? null }
}

export function mapProduct(raw: any): Product {
  const stocks: ProductStockEntry[] = Array.isArray(raw?.product_stocks)
    ? (raw.product_stocks as any[]).map(mapStockRow)
    : []

  const sizeOptions = dedupeStrings(raw?.size_options ?? [], stocks.map((row) => row.size))
  const colorOptions = dedupeStrings(raw?.color_options ?? [], stocks.map((row) => row.color))

  const totalStock = stocks.reduce((sum, row) => sum + Math.max(0, Number(row.stock) || 0), 0)

  return {
    id: String(raw.id),
    name: raw.name ?? '',
    description: raw.description ?? null,
    price: Number(raw.price ?? 0),
    images: sanitizeStringArray(raw.images),
    deleted: !!raw.deleted,
    createdAt: raw.created_at ?? '',
    updatedAt: raw.updated_at ?? raw.created_at ?? '',
    sizeOptions,
    colorOptions,
    stocks,
    totalStock,
  }
}

function mapStockRow(row: any): ProductStockEntry {
  return {
    id: String(row.id),
    productId: String(row.product_id),
    size: row.size !== undefined && row.size !== null ? String(row.size) : null,
    color: row.color !== undefined && row.color !== null ? String(row.color) : null,
    stock: Number(row.stock ?? 0),
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

function dedupeStrings(
  primary: any,
  additional: Array<string | null | undefined> = [],
): string[] {
  const set = new Set<string>()
  const push = (value: any) => {
    const normalized = typeof value === 'string' ? value.trim() : ''
    if (normalized) set.add(normalized)
  }

  if (Array.isArray(primary)) primary.forEach(push)
  additional.forEach(push)

  return Array.from(set)
}

function sanitizeStocks(rows: ProductDraft['stocks']): Array<{ size: string | null; color: string | null; stock: number }> {
  if (!Array.isArray(rows) || rows.length === 0) {
    return [{ size: null, color: null, stock: 0 }]
  }

  const seen = new Set<string>()
  const sanitized: Array<{ size: string | null; color: string | null; stock: number }> = []

  for (const row of rows) {
    if (!row) continue
    const size = normalizeNullableString(row.size)
    const color = normalizeNullableString(row.color)
    const stock = Math.max(0, Number(row.stock) || 0)
    const key = `${size ?? ''}__${color ?? ''}`
    if (seen.has(key)) continue
    seen.add(key)
    sanitized.push({ size, color, stock })
  }

  if (sanitized.length === 0) sanitized.push({ size: null, color: null, stock: 0 })
  return sanitized
}

function normalizeNullableString(value: any): string | null {
  if (value === undefined || value === null) return null
  const trimmed = String(value).trim()
  return trimmed.length === 0 ? null : trimmed
}

export function humanizeErr(e: any) {
  const code = e?.code || e?.status
  if (code === 'PGRST301' || code === 404) return 'Ressource introuvable (table/vue).'
  if (code === 'PGRST116' || code === 401) return 'Non authentifié.'
  if (code === 'PGRST302' || code === 403) return 'Accès refusé (RLS/politiques).'
  if (typeof e?.message === 'string') return e.message
  return 'Erreur inconnue.'
}
