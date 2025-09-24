<template>
  <form @submit.prevent="onSubmit" class="rounded-2xl bg-gray-800 p-5 md:p-6 shadow-xl space-y-5">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h3 class="text-xl font-heading">
          {{ isEditing ? ($t('admin.editProduct') || 'Modifier un produit') : ($t('admin.addProduct') || 'Ajouter un produit') }}
        </h3>
        <p class="text-xs opacity-70 mt-1">* {{ $t('admin.required') || 'Champs obligatoires' }}</p>
      </div>
      <div v-if="isEditing" class="text-xs px-2 py-1 rounded bg-primary/20 text-primary border border-primary/40">
        ID #{{ form.id }}
      </div>
    </div>

    <!-- Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <!-- name -->
      <div>
        <label class="block text-sm mb-1">Nom <span class="text-red-400">*</span></label>
        <input
          v-model.trim="form.name"
          class="w-full rounded-lg p-2 bg-backgroundDark border border-light/10 focus:outline-none focus:ring-2 focus:ring-primary/60"
          required
          placeholder="T-shirt Le KLOWN"
        />
        <p v-if="v.name" class="text-xs text-red-300 mt-1">{{ v.name }}</p>
      </div>

      <!-- price -->
      <div>
        <label class="block text-sm mb-1">Prix (€) <span class="text-red-400">*</span></label>
        <input
          v-model.number="form.price"
          type="number" step="0.01" min="0"
          class="w-full rounded-lg p-2 bg-backgroundDark border border-light/10 focus:outline-none focus:ring-2 focus:ring-primary/60"
          required
        />
        <p v-if="v.price" class="text-xs text-red-300 mt-1">{{ v.price }}</p>
      </div>

      <!-- description -->
      <div class="md:col-span-2">
        <label class="block text-sm mb-1">Description</label>
        <textarea v-model.trim="form.description" rows="3" class="w-full rounded-lg p-2 bg-backgroundDark border border-light/10" />
      </div>

      <!-- has_sizes + sizes[] -->
      <div>
        <label class="inline-flex items-center gap-2 text-sm">
          <input type="checkbox" v-model="form.has_sizes" class="rounded accent-primary" />
          {{ $t('admin.sizes') || 'Tailles disponibles' }}
        </label>
        <input
          v-model.trim="sizesInput"
          :disabled="!form.has_sizes"
          class="mt-2 w-full rounded-lg p-2 bg-backgroundDark border border-light/10 disabled:opacity-60"
          placeholder="Ex: S,M,L,XL"
        />
        <p class="text-[11px] opacity-60 mt-1">Séparer par des virgules.</p>
      </div>

      <!-- images[] -->
      <div>
        <label class="block text-sm mb-1">Images (URLs) <span class="text-red-400">*</span></label>
        <input
          v-model.trim="imagesInput"
          class="w-full rounded-lg p-2 bg-backgroundDark border border-light/10"
          placeholder="https://.../1.jpg, https://.../2.jpg"
          required
        />
        <p v-if="v.images" class="text-xs text-red-300 mt-1">{{ v.images }}</p>
        <p class="text-[11px] opacity-60 mt-1">Plusieurs URL séparées par des virgules.</p>
      </div>

      <!-- stock -->
      <div>
        <label class="block text-sm mb-1">Stock</label>
        <input
          v-model.number="form.stock"
          type="number" step="1" min="0"
          class="w-full rounded-lg p-2 bg-backgroundDark border border-light/10"
          placeholder="0"
        />
        <p v-if="v.stock" class="text-xs text-red-300 mt-1">{{ v.stock }}</p>
      </div>

      <!-- deleted -->
      <div class="flex items-center gap-2">
        <input id="deleted" type="checkbox" v-model="form.deleted" class="rounded accent-primary" />
        <label for="deleted" class="text-sm">Masquer (deleted)</label>
      </div>

      <!-- created_at (read-only) -->
      <div v-if="form.created_at" class="md:col-span-2 text-xs opacity-70">
        Créé le : {{ formatDateTime(form.created_at) }}
      </div>
    </div>

    <!-- Footer -->
    <p v-if="error" class="text-sm text-red-300">{{ error }}</p>

    <div class="flex items-center justify-end gap-3 pt-2">
      <button type="button" class="px-4 py-2 rounded-xl bg-backgroundDark border border-light/10" @click="reset">
        {{ $t('admin.reset') || 'Réinitialiser' }}
      </button>
      <button
        type="submit"
        :disabled="submitting || !isValid"
        class="px-5 py-2 rounded-xl bg-primary text-light font-semibold disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {{ submitting ? ($t('admin.saving') || 'Enregistrement…') : (isEditing ? ($t('admin.save') || 'Enregistrer') : ($t('admin.add') || 'Ajouter')) }}
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import { supabase } from '@/supabase/client'

const TABLE = 'products'

type DBProduct = {
  id?: string          // uuid
  name?: string
  description?: string
  price?: number | string // numeric peut revenir string
  sizes?: string[]     // text[]
  stock?: number | string
  deleted?: boolean
  created_at?: string  // timestamptz
  has_sizes?: boolean
  images?: string[]    // text[]
}

const props = defineProps<{ product: DBProduct | null }>()
const emit = defineEmits<{ (e:'saved'): void }>()

const form = reactive<Required<DBProduct>>({
  id: '' as any,                 // vide quand nouveau
  name: '',
  description: '',
  price: 0,
  sizes: [],
  stock: 0,
  deleted: false,
  created_at: '' as any,
  has_sizes: false,
  images: []
})

const sizesInput = ref('')
const imagesInput = ref('')
const submitting = ref(false)
const error = ref<string | null>(null)
const v = reactive<{ name?: string; price?: string; images?: string; stock?: string }>({})

const isEditing = computed(() => !!form.id)
const isValid = computed(() => {
  v.name   = !form.name ? 'Le nom est requis.' : undefined
  v.price  = (!isFinite(Number(form.price)) || Number(form.price) < 0) ? 'Le prix doit être un nombre ≥ 0.' : undefined
  const imgs = parseList(imagesInput.value)
  v.images = imgs.length === 0 ? 'Au moins une image est requise.' : undefined
  v.stock  = (form.stock !== undefined && form.stock !== null && Number(form.stock) < 0) ? 'Le stock doit être ≥ 0.' : undefined
  return !v.name && !v.price && !v.images && !v.stock
})

watch(() => props.product, (p) => {
  if (p) {
    Object.assign(form, {
      id: (p.id ?? '') as any,
      name: p.name || '',
      description: p.description || '',
      price: Number(p.price ?? 0),
      sizes: Array.isArray(p.sizes) ? p.sizes : [],
      stock: Number(p.stock ?? 0),
      deleted: !!p.deleted,
      created_at: p.created_at || '' as any,
      has_sizes: !!p.has_sizes,
      images: Array.isArray(p.images) ? p.images : []
    })
    sizesInput.value = form.sizes.join(',')
    imagesInput.value = form.images.join(',')
  } else {
    reset()
  }
}, { immediate: true })

function reset() {
  Object.assign(form, {
    id: '' as any,
    name: '',
    description: '',
    price: 0,
    sizes: [],
    stock: 0,
    deleted: false,
    created_at: '' as any,
    has_sizes: false,
    images: []
  })
  sizesInput.value = ''
  imagesInput.value = ''
  error.value = null
}

function parseList(input: string) {
  return input
    .split(',')
    .map(s => s.trim())
    .filter(Boolean)
}

function formatDateTime(iso?: string) {
  if (!iso) return ''
  try { return new Date(iso).toLocaleString('fr-FR') } catch { return iso }
}
async function onSubmit() {
  error.value = null
  if (!isValid.value) {
    error.value = 'Merci de renseigner les champs obligatoires (*)'
    return
  }

  form.sizes = form.has_sizes ? parseList(sizesInput.value) : []
  form.images = parseList(imagesInput.value)
  form.stock = Number(form.stock ?? 0)
  form.price = Number(form.price ?? 0)

  submitting.value = true
  try {
    const payload = {
      name: form.name,
      description: form.description || null,
      price: Number(form.price),
      sizes: form.sizes,
      stock: Number(form.stock),
      deleted: !!form.deleted,
      has_sizes: !!form.has_sizes,
      images: form.images,
    }

    const q = supabase.from(TABLE)
    const { data, error: e } = isEditing.value
      ? await q.update(payload).eq('id', form.id).select().single()
      : await q.insert(payload).select().single()

    if (e) throw e
    if (!data) throw new Error('Aucune donnée retournée.')

    emit('saved')
    reset()
  } catch (e:any) {
    const code = e?.code || e?.status
    if (code === 401) error.value = 'Vous devez être connecté.'
    else if (code === 403) error.value = 'Accès refusé (droits insuffisants).'
    else error.value = e?.message || 'Erreur lors de la sauvegarde.'
  } finally {
    submitting.value = false
  }
}

</script>

<style scoped>
.border-light\/10 { border-color: rgba(222,230,202,0.1); }
</style>
