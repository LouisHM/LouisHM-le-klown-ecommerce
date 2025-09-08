import { ref } from 'vue'
import { supabase } from '../supabase/client'

export interface Product {
  id: string
  name: string
  description: string
  price: number
  sizes: string[]
  stock: number
  deleted: boolean
  has_sizes: boolean
  images: string[]
  created_at: string
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
      .from<Product>(PUBLIC_VIEW)
      .select('*')
      .order('created_at', { ascending: true })
    if (err) error.value = humanizeErr(err)
    else products.value = data || []
    loading.value = false
    return { data, error: err }
  }

  /** Fetch single product by ID (public) */
  async function fetchProduct(id: string) {
    const { data, error: err } = await supabase
      .from<Product>(PUBLIC_VIEW)
      .select('*')
      .eq('id', id)
      .single()
    return { data, error: err }
  }

  /** Add a new product (admin only) */
  async function addProduct(input: {
    name: string
    description: string | null
    price: number
    sizes: string[]
    stock: number
    has_sizes: boolean
    images: string[]
    deleted?: boolean
  }) {
    const payload = { deleted: false, ...input }
    const { data, error: err } = await supabase
      .from<Product>(TABLE)
      .insert([payload])
      .select()
      .single()
    return { data, error: err }
  }

  /** Update an existing product (admin only) */
  async function updateProduct(id: string, updates: Partial<Omit<Product, 'id'>>) {
    const { data, error: err } = await supabase
      .from<Product>(TABLE)
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    return { data, error: err }
  }

  /** Soft-delete a product (admin only) */
  async function deleteProduct(id: string) {
    const { data, error: err } = await supabase
      .from<Product>(TABLE)
      .update({ deleted: true })
      .eq('id', id)
      .select()
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
