// src/composables/useProducts.ts
import { ref } from 'vue'
import { supabase } from '@/supabase/client' // use alias

export interface ProductOptionValue {
  id: string
  code: string
  label: string
  metadata: Record<string, any> | null
  sort_order?: number
}

export interface ProductOptionGroup {
  id: string
  code: string
  label: string
  required: boolean
  multi: boolean
  sort_order?: number
  values: ProductOptionValue[]
}

export interface ProductVariant {
  id: string
  stock: number
  optionValueIds: string[]
  options: Record<string, string | string[]>
  isActive?: boolean
  deleted?: boolean
  sku?: string | null
}

export interface Product {
  id: string
  name: string
  description: string | null
  price: number
  images: string[]
  deleted: boolean
  created_at: string
  totalStock: number
  options: ProductOptionGroup[]
  variants: ProductVariant[]
}

const TABLE = 'products'
const PUBLIC_VIEW = 'products_public' // vue lecture seule, filtrée

export function useProducts() {
  const products = ref<Product[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  /** Fetch all public products (non supprimés) */
  async function fetchProducts() {
    loading.value = true
    error.value = null

    const { data, error: err } = await supabase
      .from(PUBLIC_VIEW)
      .select('*')
      .order('created_at', { ascending: true })

    if (err) error.value = humanizeErr(err)
    else products.value = Array.isArray(data) ? data.map(mapProduct) : []

    loading.value = false
    return { data: products.value, error: err }
  }

  /** Fetch single product by ID (public) */
  async function fetchProduct(id: string) {
    const { data, error: err } = await supabase
      .from(PUBLIC_VIEW)
      .select('*')
      .eq('id', id)
      .single()

    return { data: data ? mapProduct(data) : null, error: err }
  }

  /** Add a new product (admin only) */
  async function addProduct(input: {
    name: string
    description: string | null
    price: number
    images: string[]
    deleted?: boolean
  }) {
    const payload = {
      deleted: false,
      ...input,
      price: Number(input.price) || 0,
      images: sanitizeStringArray(input.images),
      has_sizes: false,
      sizes: [],
      stock: 0,
    }

    const { data, error: err } = await supabase
      .from(TABLE)
      .insert([payload])
      .select('*')
      .single()

    return { data: data ? mapProduct(data) : null, error: err }
  }

  /** Update an existing product (admin only) */
  async function updateProduct(id: string, updates: {
    name?: string
    description?: string | null
    price?: number
    images?: string[]
    deleted?: boolean
  }) {
    const payload: Record<string, any> = {}
    if (updates.name !== undefined) payload.name = updates.name
    if (updates.description !== undefined) payload.description = updates.description
    if (updates.price !== undefined) payload.price = Number(updates.price) || 0
    if (updates.images !== undefined) payload.images = sanitizeStringArray(updates.images)
    if (updates.deleted !== undefined) payload.deleted = !!updates.deleted

    const { data, error: err } = await supabase
      .from(TABLE)
      .update(payload)
      .eq('id', id)
      .select('*')
      .single()

    return { data: data ? mapProduct(data) : null, error: err }
  }

  /** Soft-delete a product (admin only) */
  async function deleteProduct(id: string) {
    // Soft-delete (set deleted=true) but return the updated row so clients can react
    const { data, error: err } = await supabase
      .from(TABLE)
      .update({ deleted: true })
      .eq('id', id)
      .select('id, deleted, name')
      .single()

    return { data, error: err }
  }

  function humanizeErr(e: any) {
    const code = e?.code || e?.status
    if (code === 'PGRST301' || code === 404) return 'Ressource introuvable (table/vue).'
    if (code === 'PGRST116' || code === 401) return 'Non authentifié.'
    if (code === 'PGRST302' || code === 403) return 'Accès refusé (RLS/politiques).'
    return e?.message || 'Erreur inconnue.'
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
  }
}

function mapProduct(raw: any): Product {
  return {
    id: String(raw.id),
    name: raw.name ?? '',
    description: raw.description ?? null,
    price: Number(raw.price ?? 0),
    images: sanitizeStringArray(raw.images),
    deleted: !!raw.deleted,
    created_at: raw.created_at ?? '',
    totalStock: Number(raw.total_stock ?? raw.stock ?? 0),
    options: mapOptionGroups(raw.options),
    variants: mapVariants(raw.variants),
  }
}

function mapOptionGroups(value: any): ProductOptionGroup[] {
  if (!Array.isArray(value)) return []

  return value
    .map((group: any, idx: number): ProductOptionGroup => ({
      id: String(group.id ?? `g-${idx}`),
      code: group.code ?? `option_${idx + 1}`,
      label: group.label ?? group.code ?? `Option ${idx + 1}`,
      required: !!group.required,
      multi: !!group.multi,
      sort_order: typeof group.sort_order === 'number' ? group.sort_order : idx,
      values: mapOptionValues(group.values),
    }))
    .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
}

function mapOptionValues(value: any): ProductOptionValue[] {
  if (!Array.isArray(value)) return []

  return value
    .map((row: any, idx: number): ProductOptionValue => ({
      id: String(row.id ?? `v-${idx}`),
      code: row.code ?? `value_${idx + 1}`,
      label: row.label ?? row.code ?? `Valeur ${idx + 1}`,
      metadata: row.metadata && typeof row.metadata === 'object' ? row.metadata : null,
      sort_order: typeof row.sort_order === 'number' ? row.sort_order : idx,
    }))
    .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
}

function mapVariants(value: any): ProductVariant[] {
  if (!Array.isArray(value)) return []

  return value.map((row: any): ProductVariant => ({
    id: String(row.id),
    stock: Number(row.stock ?? 0),
    optionValueIds: Array.isArray(row.optionValueIds)
      ? row.optionValueIds.map((id: any) => String(id))
      : [],
    options: normalizeOptions(row.options),
    isActive: row.is_active ?? row.isActive ?? true,
    deleted: row.deleted ?? false,
    sku: row.sku ?? null,
  }))
}

function normalizeOptions(value: any): Record<string, string | string[]> {
  if (!value || typeof value !== 'object') return {}
  const normalized: Record<string, string | string[]> = {}
  for (const key of Object.keys(value)) {
    const entry = (value as any)[key]
    if (Array.isArray(entry)) {
      normalized[key] = entry.map((item) => String(item))
    } else if (entry !== null && entry !== undefined) {
      normalized[key] = String(entry)
    }
  }
  return normalized
}

function sanitizeStringArray(value: any): string[] {
  if (Array.isArray(value)) return value.map(String).filter(Boolean)
  if (typeof value === 'string') {
    return value
      .split(',')
      .map(v => v.trim())
      .filter(Boolean)
  }
  return []
}
