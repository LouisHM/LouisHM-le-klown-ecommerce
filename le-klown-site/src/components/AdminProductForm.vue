<template>
  <form @submit.prevent="handleSubmit" class="space-y-6">
    <header class="flex flex-wrap justify-between gap-3 items-center">
      <div>
        <h3 class="text-xl font-heading">
          {{ product ? ($t('admin.editProduct') || 'Modifier un produit') : ($t('admin.addProduct') || 'Ajouter un produit') }}
        </h3>
        <p class="text-sm text-light/60">
          {{ $t('admin.productFormHint') || 'Configure un produit simple avec tailles et couleurs optionnelles.' }}
        </p>
      </div>
      <button
        v-if="product"
        type="button"
        class="btn btn-secondary btn-sm"
        @click="resetForm()"
      >
        {{ $t('admin.reset') || 'Réinitialiser' }}
      </button>
    </header>

    <section class="bg-backgroundDark/70 border border-light/10 rounded-2xl p-5 space-y-4">
      <h4 class="font-semibold text-lg">{{ $t('admin.productInfos') || 'Informations produit' }}</h4>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <label class="block space-y-1 md:col-span-2">
          <span class="text-sm font-semibold">{{ $t('admin.name') || 'Nom' }} *</span>
          <input
            v-model.trim="form.name"
            class="input"
            required
          />
        </label>

        <label class="block space-y-1">
          <span class="text-sm font-semibold">{{ $t('admin.price') || 'Prix (€)' }} *</span>
          <input
            v-model.number="form.price"
            type="number"
            step="0.01"
            min="0"
            class="input"
            required
          />
        </label>

        <label class="block space-y-1">
          <span class="text-sm font-semibold">{{ $t('admin.sortOrder') || 'Ordre d’affichage' }}</span>
          <input
            v-model.number="form.sortOrder"
            type="number"
            step="1"
            min="0"
            class="input"
          />
          <p class="text-xs text-light/60">
            {{ $t('admin.sortOrderHint') || 'Plus le nombre est petit, plus le produit apparaît haut dans la liste.' }}
          </p>
        </label>

        <label class="block md:col-span-3 space-y-1">
          <span class="text-sm font-semibold">{{ $t('admin.description') || 'Description' }}</span>
          <textarea
            v-model.trim="form.description"
            rows="3"
            class="input resize-y"
          />
        </label>
      </div>

      <div class="space-y-2">
        <div class="flex justify-between items-center">
          <span class="text-sm font-semibold">{{ $t('admin.images') || 'Images (URL)' }} *</span>
          <button type="button" class="btn btn-secondary btn-sm" @click="addImageField">
            + {{ $t('admin.addImage') || 'Ajouter' }}
          </button>
        </div>

        <div class="space-y-2">
          <div
            v-for="(value, idx) in form.images"
            :key="`img-${idx}`"
            class="flex gap-2 items-center"
          >
            <input
              v-model="form.images[idx]"
              class="input flex-1"
              placeholder="https://..."
            />
            <button
              type="button"
              class="btn btn-red btn-sm"
              @click="removeImageField(idx)"
              :disabled="form.images.length === 1"
            >
              {{ $t('admin.remove') || 'Retirer' }}
            </button>
          </div>
        </div>

        <div class="space-y-2 pt-2 border-t border-white/10">
          <label class="block text-sm font-semibold">
            {{ $t('admin.uploadImageLabel') || 'Téléverser une image (JPG/PNG)' }}
          </label>
          <input
            type="file"
            accept="image/png,image/jpeg"
            class="block w-full text-sm text-light/80 file:mr-3 file:py-1.5 file:px-3 file:rounded file:border-0 file:bg-primary/20 file:text-primary"
            :disabled="uploadingImage"
            @change="onUploadProductImage"
          />
          <p class="text-[11px] opacity-60">
            {{ $t('admin.uploadImageHelp', { bucket: bucketName }) || `Les fichiers sont stockés dans ${bucketName}.` }}
          </p>
          <p v-if="uploadingImage" class="text-xs text-primary">
            {{ $t('admin.uploadingImage') || 'Upload en cours…' }}
          </p>
          <p v-if="uploadImageError" class="text-xs text-error">
            {{ uploadImageError }}
          </p>
        </div>
      </div>
    </section>

    <section class="bg-backgroundDark/70 border border-light/10 rounded-2xl p-5 space-y-4">
      <div class="flex flex-wrap justify-between items-center gap-3">
        <h4 class="font-semibold text-lg">{{ $t('admin.options') || 'Tailles & couleurs' }}</h4>
        <button type="button" class="btn btn-white btn-sm" @click="generateFromOptions">
          {{ $t('admin.generateVariants') || 'Générer les combinaisons' }}
        </button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="space-y-2">
          <div class="flex justify-between items-center">
            <span class="text-sm font-semibold">{{ $t('admin.sizes') || 'Tailles disponibles' }}</span>
            <button type="button" class="btn btn-secondary btn-sm" @click="addSize">
              + {{ $t('admin.addValue') || 'Ajouter' }}
            </button>
          </div>
          <div class="space-y-2">
            <div
              v-for="(value, idx) in form.sizeOptions"
              :key="`size-${idx}`"
              class="flex gap-2 items-center"
            >
              <input
                v-model.trim="form.sizeOptions[idx]"
                class="input flex-1"
                placeholder="ex: S"
              />
              <button class="btn btn-red btn-sm" type="button" @click="removeSize(idx)">
                {{ $t('admin.remove') || 'Retirer' }}
              </button>
            </div>
            <p class="text-xs text-light/60">
              {{ $t('admin.sizeHint') || 'Laisse vide si le produit n’a pas de tailles.' }}
            </p>
          </div>
        </div>

        <div class="space-y-2">
          <div class="flex justify-between items-center">
            <span class="text-sm font-semibold">{{ $t('admin.colors') || 'Couleurs disponibles' }}</span>
            <button type="button" class="btn btn-secondary btn-sm" @click="addColor">
              + {{ $t('admin.addValue') || 'Ajouter' }}
            </button>
          </div>
          <div class="space-y-2">
            <div
              v-for="(value, idx) in form.colorOptions"
              :key="`color-${idx}`"
              class="flex gap-2 items-center"
            >
              <input
                v-model.trim="form.colorOptions[idx]"
                class="input flex-1"
                placeholder="ex: Rouge"
              />
              <button class="btn btn-red btn-sm" type="button" @click="removeColor(idx)">
                {{ $t('admin.remove') || 'Retirer' }}
              </button>
            </div>
            <p class="text-xs text-light/60">
              {{ $t('admin.colorHint') || 'Laisse vide si le produit n’a pas de couleur.' }}
            </p>
          </div>
        </div>
      </div>

      <div class="space-y-3">
        <div class="flex items-center justify-between">
          <span class="text-sm font-semibold">{{ $t('admin.stocks') || 'Stocks par combinaison' }}</span>
          <button type="button" class="btn btn-secondary btn-sm" @click="addStockRow">
            + {{ $t('admin.addVariant') || 'Ajouter une ligne' }}
          </button>
        </div>

        <div class="overflow-x-auto">
          <table class="min-w-full text-sm border border-white/10 rounded-lg overflow-hidden">
            <thead>
              <tr class="bg-black/40 uppercase text-[11px] tracking-wide">
                <th class="px-3 py-2 text-left">{{ $t('admin.size') || 'Taille' }}</th>
                <th class="px-3 py-2 text-left">{{ $t('admin.color') || 'Couleur' }}</th>
                <th class="px-3 py-2 text-left">{{ $t('admin.stock') || 'Stock' }}</th>
                <th class="px-3 py-2"></th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="row in stockRows"
                :key="row.localId"
                class="border-t border-white/10"
              >
                <td class="px-3 py-2">
                  <input
                    v-model.trim="row.size"
                    class="input h-10"
                    :placeholder="form.sizeOptions.length ? $t('admin.chooseValue') || 'Choisis' : $t('admin.optional') || 'Optionnel'"
                    list="size-options"
                  />
                </td>
                <td class="px-3 py-2">
                  <input
                    v-model.trim="row.color"
                    class="input h-10"
                    :placeholder="form.colorOptions.length ? $t('admin.chooseValue') || 'Choisis' : $t('admin.optional') || 'Optionnel'"
                    list="color-options"
                  />
                </td>
                <td class="px-3 py-2">
                  <input
                    v-model.number="row.stock"
                    type="number"
                    min="0"
                    class="input h-10"
                  />
                </td>
                <td class="px-3 py-2 text-right">
                  <button
                    type="button"
                    class="btn btn-red btn-sm"
                    :disabled="stockRows.length <= 1"
                    @click="removeStockRow(row.localId)"
                  >
                    {{ $t('admin.remove') || 'Retirer' }}
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <p class="text-xs text-light/60">
          {{ $t('admin.totalStock') || 'Stock total' }} : <span class="font-semibold">{{ totalStock }}</span>
        </p>
      </div>
    </section>

    <p v-if="formError" class="text-sm text-error">{{ formError }}</p>

    <footer class="flex justify-end gap-3">
      <button type="button" class="btn btn-black" @click="resetForm()">
        {{ $t('admin.reset') || 'Réinitialiser' }}
      </button>
      <button type="submit" class="btn btn-red" :disabled="submitting">
        {{ submitting ? ($t('admin.saving') || 'Enregistrement…') : ($t('admin.save') || 'Enregistrer') }}
      </button>
    </footer>

    <datalist id="size-options">
      <option v-for="value in form.sizeOptions" :key="`size-opt-${value}`">{{ value }}</option>
    </datalist>
    <datalist id="color-options">
      <option v-for="value in form.colorOptions" :key="`color-opt-${value}`">{{ value }}</option>
    </datalist>
  </form>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch, nextTick } from 'vue'
import { useI18n } from 'vue-i18n'
import { supabase } from '@/supabase/client'
import type { Product, ProductStockEntry, ProductDraft } from '@/composables/useProducts'
import { useProducts } from '@/composables/useProducts'
import { uploadImageToStorage, requiredBucketName } from '@/utils/storage'

interface StockRowDraft {
  localId: string
  id?: string
  size: string
  color: string
  stock: number
}

const props = defineProps<{
  product: Product | null
}>()

const emit = defineEmits<{ (e: 'saved'): void }>()

const { addProduct, updateProduct } = useProducts()
const { t } = useI18n()

const submitting = ref(false)
const formError = ref<string | null>(null)
const autoGenerateStocks = ref(true)
const uploadingImage = ref(false)
const uploadImageError = ref<string | null>(null)
const isDev = import.meta.env.DEV
const bucketName = requiredBucketName()

function debugLog(...args: any[]) {
  if (isDev) console.debug(...args)
}

const form = reactive({
  id: '' as string | null,
  name: '',
  description: '' as string | null,
  price: 0,
  sortOrder: 0,
  images: [''] as string[],
  sizeOptions: [] as string[],
  colorOptions: [] as string[],
  deleted: false,
})

const stockRows = ref<StockRowDraft[]>([])

const totalStock = computed(() =>
  stockRows.value.reduce((sum, row) => sum + Math.max(0, Number(row.stock) || 0), 0)
)

watch(
  () => props.product,
  (product) => {
    loadFromProduct(product)
  },
  { immediate: true },
)

watch(
  () => form.sizeOptions.map((value) => value.trim()).join('|'),
  () => scheduleAutoGenerate(),
)

watch(
  () => form.colorOptions.map((value) => value.trim()).join('|'),
  () => scheduleAutoGenerate(),
)

function loadFromProduct(product: Product | null) {
  autoGenerateStocks.value = false
  form.id = product?.id ?? null
  form.name = product?.name ?? ''
  form.description = product?.description ?? ''
  form.price = Number(product?.price ?? 0)
  form.sortOrder = Number(product?.sortOrder ?? 0)
  form.images = (product?.images ?? []).length ? [...product!.images] : ['']
  form.sizeOptions = [...(product?.sizeOptions ?? [])]
  form.colorOptions = [...(product?.colorOptions ?? [])]
  form.deleted = !!product?.deleted

  const rows = product?.stocks?.length
    ? product!.stocks.map(mapStockToDraft)
    : [createEmptyStockRow()]

  stockRows.value = dedupeStockRows(rows)
  ensureAtLeastOneRow()
  formError.value = null
  nextTick(() => {
    autoGenerateStocks.value = true
  })
}

function createEmptyStockRow(): StockRowDraft {
  return {
    localId: crypto.randomUUID(),
    size: '',
    color: '',
    stock: 0,
  }
}

function mapStockToDraft(entry: ProductStockEntry): StockRowDraft {
  return {
    localId: crypto.randomUUID(),
    id: entry.id,
    size: entry.size ?? '',
    color: entry.color ?? '',
    stock: Number(entry.stock ?? 0),
  }
}

function addImageField() {
  form.images.push('')
}

function removeImageField(idx: number) {
  if (form.images.length <= 1) {
    form.images[0] = ''
  } else {
    form.images.splice(idx, 1)
  }
}

async function onUploadProductImage(event: Event) {
  const input = event.target as HTMLInputElement | null
  const file = input?.files?.[0]
  if (!file) return

  uploadImageError.value = null
  uploadingImage.value = true

  try {
    const identifier = form.id || form.name || 'product'
    const publicUrl = await uploadImageToStorage(file, 'products', identifier || 'product')
    debugLog('[AdminProductForm] image uploaded', publicUrl)

    const blankIndex = form.images.findIndex((img) => !img.trim())
    if (blankIndex >= 0) {
      form.images[blankIndex] = publicUrl
    } else if (!form.images.includes(publicUrl)) {
      form.images.push(publicUrl)
    }
  } catch (err: any) {
    debugLog('[AdminProductForm] image upload error', err)
    uploadImageError.value = err?.message || t('common.error') || 'Une erreur est survenue.'
  } finally {
    uploadingImage.value = false
    if (input) input.value = ''
  }
}

function addSize() {
  form.sizeOptions.push('')
  scheduleAutoGenerate()
}

function removeSize(idx: number) {
  form.sizeOptions.splice(idx, 1)
  scheduleAutoGenerate()
}

function addColor() {
  form.colorOptions.push('')
  scheduleAutoGenerate()
}

function removeColor(idx: number) {
  form.colorOptions.splice(idx, 1)
  scheduleAutoGenerate()
}

function addStockRow() {
  stockRows.value.push(createEmptyStockRow())
}

function removeStockRow(localId: string) {
  if (stockRows.value.length <= 1) return
  stockRows.value = stockRows.value.filter((row) => row.localId !== localId)
  ensureAtLeastOneRow()
}

function ensureAtLeastOneRow() {
  if (stockRows.value.length === 0) stockRows.value.push(createEmptyStockRow())
}

let autoGenerateTimeout: ReturnType<typeof setTimeout> | null = null
function scheduleAutoGenerate() {
  if (!autoGenerateStocks.value) return
  if (autoGenerateTimeout) clearTimeout(autoGenerateTimeout)
  autoGenerateTimeout = setTimeout(() => {
    generateFromOptions()
    autoGenerateTimeout = null
  }, 150)
}

function generateFromOptions() {
  const sizes = sanitizeOptionList(form.sizeOptions)
  const colors = sanitizeOptionList(form.colorOptions)

  if (sizes.length === 0 && colors.length === 0) {
    stockRows.value = [createEmptyStockRow()]
    return
  }

  const map = new Map<string, StockRowDraft>()

  for (const row of stockRows.value) {
    const key = `${(row.size || '').trim().toLowerCase()}__${(row.color || '').trim().toLowerCase()}`
    map.set(key, row)
  }

  const rows: StockRowDraft[] = []
  if (sizes.length && colors.length) {
    for (const size of sizes) {
      for (const color of colors) {
        rows.push(rowFor(size, color, map))
      }
    }
  } else if (sizes.length) {
    for (const size of sizes) rows.push(rowFor(size, '', map))
  } else if (colors.length) {
    for (const color of colors) rows.push(rowFor('', color, map))
  }

  stockRows.value = dedupeStockRows(rows)
  ensureAtLeastOneRow()
}

function rowFor(size: string, color: string, existing: Map<string, StockRowDraft>): StockRowDraft {
  const key = `${size.trim().toLowerCase()}__${color.trim().toLowerCase()}`
  const found = existing.get(key)
  if (found) {
    return { ...found, localId: crypto.randomUUID(), size, color }
  }
  return {
    localId: crypto.randomUUID(),
    size,
    color,
    stock: 0,
  }
}

function dedupeStockRows(rows: StockRowDraft[]): StockRowDraft[] {
  const seen = new Set<string>()
  const result: StockRowDraft[] = []
  for (const row of rows) {
    const key = `${row.size.trim().toLowerCase()}__${row.color.trim().toLowerCase()}`
    if (seen.has(key)) continue
    seen.add(key)
    result.push(row)
  }
  return result.length ? result : [createEmptyStockRow()]
}

function sanitizeOptionList(values: string[]): string[] {
  return values
    .map((value) => value.trim())
    .filter((value, idx, arr) => value.length > 0 && arr.indexOf(value) === idx)
}

function buildDraft(): ProductDraft {
  const sizeOptions = sanitizeOptionList(form.sizeOptions)
  const colorOptions = sanitizeOptionList(form.colorOptions)
  const stocks = stockRows.value.map((row) => ({
    id: row.id,
    size: row.size.trim() || null,
    color: row.color.trim() || null,
    stock: Math.max(0, Number(row.stock) || 0),
  }))

  return {
    id: form.id ?? undefined,
    name: form.name.trim(),
    description: form.description?.trim() || null,
    price: Number(form.price) || 0,
    sortOrder: Math.trunc(Number(form.sortOrder) || 0),
    images: form.images,
    sizeOptions,
    colorOptions,
    stocks,
    deleted: form.deleted,
  }
}

async function handleSubmit() {
  formError.value = null

  debugLog('[AdminProductForm] handleSubmit invoked', {
    formId: form.id,
    nameLength: form.name.length,
    imagesCount: form.images.filter(Boolean).length,
    sizeOptions: form.sizeOptions,
    colorOptions: form.colorOptions,
    stockRows: stockRows.value.length,
  })

  await logCurrentRole('handleSubmit:start')

  if (!form.name.trim()) {
    debugLog('[AdminProductForm] validation failed', 'name')
    formError.value = t('admin.validationName') || 'Le nom est requis.'
    return
  }

  const images = form.images.map((value) => value.trim()).filter(Boolean)
  if (images.length === 0) {
    debugLog('[AdminProductForm] validation failed', 'images')
    formError.value = t('admin.imageRequired') || 'Ajoute au moins une image.'
    return
  }

  const draft = buildDraft()
  debugLog('[AdminProductForm] submitting draft', draft)

  submitting.value = true
  const isEditing = !!form.id

  const result = isEditing
    ? await updateProduct(form.id!, draft)
    : await addProduct(draft)

  submitting.value = false

  if (result.error) {
    await logCurrentRole('handleSubmit:error')
    console.error('[AdminProductForm] save error', result.error)
    formError.value = humanizeError(result.error) || JSON.stringify(result.error)
    debugLog('[AdminProductForm] handleSubmit result error', {
      isEditing,
      error: result.error,
    })
    return
  }

  debugLog('[AdminProductForm] handleSubmit success', {
    isEditing,
    productId: result.data?.id ?? form.id ?? null,
  })

  if (!isEditing) {
    resetForm()
  } else if (result.data) {
    loadFromProduct(result.data)
  }

  emit('saved')
}

function resetForm() {
  loadFromProduct(props.product ?? null)
}

function humanizeError(err: any) {
  if (!err) return null
  if (typeof err === 'string') return err
  if (err.message) return err.message
  return t('common.error') || 'Une erreur est survenue.'
}

async function logCurrentRole(context: string) {
  try {
    const { data } = await supabase.auth.getSession()
    const session = data?.session ?? null
    const user = session?.user ?? null
    console.debug('[AdminProductForm] role debug', context, {
      userId: user?.id ?? null,
      email: user?.email ?? null,
      aud: user?.aud ?? null,
      appRole: user?.app_metadata?.role ?? null,
      provider: user?.app_metadata?.provider ?? null,
      metadataRole: user?.user_metadata?.role ?? null,
    })
    if (user?.id) {
      const { data: profile } = await supabase
        .from('utilisateurs')
        .select('role')
        .eq('id', user.id)
        .maybeSingle()
      console.debug('[AdminProductForm] role debug profile', profile)
    }
  } catch (err) {
    console.debug('[AdminProductForm] role debug error', context, err)
  }
}
</script>

<style scoped>
.input {
  @apply w-full rounded-lg border border-white/15 bg-black/30 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40;
}
</style>
