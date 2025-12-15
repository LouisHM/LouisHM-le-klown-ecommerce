<template>
  <form @submit.prevent="handleSubmit" class="space-y-6">
    <header class="flex flex-wrap justify-between gap-3 items-center">
      <div>
        <h3 class="text-xl font-heading">
          {{ pack ? ($t('admin.editPack') || 'Modifier un pack') : ($t('admin.addPack') || 'Ajouter un pack') }}
        </h3>
        <p class="text-sm text-light/60">
          {{ $t('admin.packFormHint') || 'Compose un pack en sélectionnant plusieurs produits.' }}
        </p>
      </div>
      <button
        v-if="pack"
        type="button"
        class="btn btn-secondary btn-sm"
        @click="resetForm()"
      >
        {{ $t('admin.reset') || 'Réinitialiser' }}
      </button>
    </header>

    <section class="bg-backgroundDark/70 border border-light/10 rounded-2xl p-5 space-y-4">
      <h4 class="font-semibold text-lg">{{ $t('admin.packInfos') || 'Informations du pack' }}</h4>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <label class="block space-y-1">
          <span class="text-sm font-semibold">{{ $t('admin.name') || 'Nom' }} *</span>
          <input v-model.trim="form.name" class="input" required />
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

        <label class="block md:col-span-2 space-y-1">
          <span class="text-sm font-semibold">{{ $t('admin.description') || 'Description' }}</span>
          <textarea v-model.trim="form.description" rows="3" class="input resize-y" />
        </label>
      </div>

      <div class="space-y-2">
        <div class="flex justify-between items-center">
          <span class="text-sm font-semibold">{{ $t('admin.images') || 'Images (URL)' }}</span>
          <button type="button" class="btn btn-secondary btn-sm" @click="addImageField">
            + {{ $t('admin.addImage') || 'Ajouter' }}
          </button>
        </div>
        <div class="space-y-2">
          <div
            v-for="(value, idx) in form.images"
            :key="`pack-img-${idx}`"
            class="flex gap-2 items-center"
          >
            <input v-model="form.images[idx]" class="input flex-1" placeholder="https://..." />
            <button
              class="btn btn-red btn-sm"
              type="button"
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
            @change="onUploadPackImage"
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
        <h4 class="font-semibold text-lg">{{ $t('admin.packItems') || 'Contenu du pack' }}</h4>
        <button type="button" class="btn btn-secondary btn-sm" @click="addItemRow">
          + {{ $t('admin.addProduct') || 'Ajouter un produit' }}
        </button>
      </div>

      <div class="overflow-x-auto">
        <table class="min-w-full text-sm border border-white/10 rounded-lg">
          <thead>
            <tr class="bg-black/40 uppercase text-[11px] tracking-wide">
              <th class="px-3 py-2 text-left">{{ $t('admin.product') || 'Produit' }}</th>
              <th class="px-3 py-2 text-left">{{ $t('admin.quantity') || 'Quantité' }}</th>
              <th class="px-3 py-2 text-left">{{ $t('admin.details') || 'Détails' }}</th>
              <th class="px-3 py-2"></th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="row in itemRows"
              :key="row.localId"
              class="border-t border-white/10"
            >
              <td class="px-3 py-2 align-middle min-w-[220px]">
                <select
                  v-model="row.productId"
                  class="input"
                  :required="itemRows.length === 1"
                >
                  <option value="">{{ $t('admin.chooseProduct') || 'Sélectionne un produit' }}</option>
                  <option
                    v-for="product in products"
                    :key="product.id"
                    :value="product.id"
                  >
                    {{ product.name }}
                  </option>
                </select>
              </td>
              <td class="px-3 py-2 align-middle w-32">
                <input
                  v-model.number="row.quantity"
                  type="number"
                  min="1"
                  class="input h-10"
                />
              </td>
              <td class="px-3 py-2 text-xs text-light/70 align-top">
                <template v-if="row.productId">
                  <div class="space-y-1">
                    <div class="font-semibold">{{ productById(row.productId)?.name }}</div>
                    <div v-if="productById(row.productId)?.sizeOptions?.length">
                      <span class="font-semibold">{{ $t('admin.sizes') || 'Tailles' }}:</span>
                      {{ productById(row.productId)?.sizeOptions.join(', ') }}
                    </div>
                    <div v-if="productById(row.productId)?.colorOptions?.length">
                      <span class="font-semibold">{{ $t('admin.colors') || 'Couleurs' }}:</span>
                      {{ productById(row.productId)?.colorOptions.join(', ') }}
                    </div>
                  </div>
                </template>
                <span v-else class="text-light/40">
                  {{ $t('admin.packItemHint') || 'Choisis un produit du catalogue.' }}
                </span>
              </td>
              <td class="px-3 py-2 text-right">
                <button
                  class="btn btn-red btn-sm"
                  type="button"
                  @click="removeItemRow(row.localId)"
                  :disabled="itemRows.length === 1"
                >
                  {{ $t('admin.remove') || 'Retirer' }}
                </button>
              </td>
            </tr>
          </tbody>
        </table>
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
  </form>
</template>

<script setup lang="ts">
import { reactive, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import type { Pack, PackItem as PackItemRecord } from '@/composables/usePacks'
import type { Product } from '@/composables/useProducts'
import { usePacks } from '@/composables/usePacks'
import { uploadImageToStorage, requiredBucketName } from '@/utils/storage'

interface PackItemDraft {
  localId: string
  id?: string
  productId: string
  quantity: number
  sortOrder: number
}

const props = defineProps<{
  pack: Pack | null
  products: Product[]
}>()

const emit = defineEmits<{ (e: 'saved'): void }>()

const { addPack, updatePack } = usePacks()
const { t } = useI18n()

const submitting = ref(false)
const formError = ref<string | null>(null)
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
  images: [''] as string[],
  deleted: false,
})

const itemRows = ref<PackItemDraft[]>([])

watch(
  () => props.pack,
  (pack) => {
    loadFromPack(pack)
  },
  { immediate: true },
)

function loadFromPack(pack: Pack | null) {
  form.id = pack?.id ?? null
  form.name = pack?.name ?? ''
  form.description = pack?.description ?? ''
  form.price = Number(pack?.price ?? 0)
  form.images = (pack?.images ?? []).length ? [...pack!.images] : ['']
  form.deleted = !!pack?.deleted
  itemRows.value = pack?.items?.length
    ? pack!.items.map(mapPackItemToDraft)
    : [createEmptyItemRow()]
  ensureAtLeastOneItem()
  formError.value = null
  uploadImageError.value = null
}

function addImageField() {
  form.images.push('')
}

function removeImageField(idx: number) {
  if (form.images.length <= 1) form.images[0] = ''
  else form.images.splice(idx, 1)
}

async function onUploadPackImage(event: Event) {
  const input = event.target as HTMLInputElement | null
  const file = input?.files?.[0]
  if (!file) return

  uploadImageError.value = null
  uploadingImage.value = true

  try {
    const identifier = form.id || form.name || 'pack'
    const publicUrl = await uploadImageToStorage(file, 'packs', identifier || 'pack')
    debugLog('[AdminPackForm] image uploaded', publicUrl)

    const blankIndex = form.images.findIndex((img) => !img.trim())
    if (blankIndex >= 0) {
      form.images[blankIndex] = publicUrl
    } else if (!form.images.includes(publicUrl)) {
      form.images.push(publicUrl)
    }
  } catch (err: any) {
    debugLog('[AdminPackForm] image upload error', err)
    uploadImageError.value = err?.message || t('common.error') || 'Une erreur est survenue.'
  } finally {
    uploadingImage.value = false
    if (input) input.value = ''
  }
}

function createEmptyItemRow(): PackItemDraft {
  return {
    localId: crypto.randomUUID(),
    productId: '',
    quantity: 1,
    sortOrder: itemRows.value.length,
  }
}

function addItemRow() {
  itemRows.value.push(createEmptyItemRow())
}

function removeItemRow(localId: string) {
  if (itemRows.value.length <= 1) return
  itemRows.value = itemRows.value.filter((row) => row.localId !== localId)
  normalizeSortOrders()
  ensureAtLeastOneItem()
}

function ensureAtLeastOneItem() {
  if (itemRows.value.length === 0) itemRows.value.push(createEmptyItemRow())
}

function normalizeSortOrders() {
  itemRows.value = itemRows.value.map((row, idx) => ({ ...row, sortOrder: idx }))
}

function mapPackItemToDraft(item: PackItemRecord): PackItemDraft {
  return {
    localId: crypto.randomUUID(),
    id: item.id,
    productId: item.productId,
    quantity: Math.max(1, Number(item.quantity) || 1),
    sortOrder: Number(item.sortOrder ?? 0),
  }
}

function buildDraft() {
  normalizeSortOrders()
  return {
    id: form.id ?? undefined,
    name: form.name.trim(),
    description: form.description?.trim() || null,
    price: Number(form.price) || 0,
    images: form.images,
    items: itemRows.value
      .filter((row) => row.productId)
      .map((row) => ({
        id: row.id,
        productId: row.productId,
        quantity: Math.max(1, Number(row.quantity) || 1),
        sortOrder: row.sortOrder,
      })),
    deleted: form.deleted,
  }
}

async function handleSubmit() {
  formError.value = null
  debugLog('[AdminPackForm] handleSubmit invoked', {
    formId: form.id,
    nameLength: form.name.length,
    imagesCount: form.images.filter(Boolean).length,
    items: itemRows.value.map((row) => ({ productId: row.productId, quantity: row.quantity })),
  })

  if (!form.name.trim()) {
    debugLog('[AdminPackForm] validation failed', 'name')
    formError.value = t('admin.validationName') || 'Le nom est requis.'
    return
  }

  if (!itemRows.value.some((row) => row.productId)) {
    debugLog('[AdminPackForm] validation failed', 'items')
    formError.value = t('admin.validationPackItems') || 'Ajoute au moins un produit au pack.'
    return
  }

  const images = form.images.map((value) => value.trim()).filter(Boolean)
  if (images.length === 0) {
    debugLog('[AdminPackForm] validation failed', 'images')
    formError.value = t('admin.imageRequired') || 'Ajoute au moins une image.'
    return
  }

  submitting.value = true
  const draft = buildDraft()
  debugLog('[AdminPackForm] submitting draft', draft)
  const isEditing = !!form.id

  const result = isEditing
    ? await updatePack(form.id!, draft)
    : await addPack(draft)

  submitting.value = false

  if (result.error) {
    formError.value = humanizeError(result.error)
    debugLog('[AdminPackForm] handleSubmit result error', {
      isEditing,
      error: result.error,
    })
    return
  }

  debugLog('[AdminPackForm] handleSubmit success', {
    isEditing,
    packId: result.data?.id ?? form.id ?? null,
  })

  if (!isEditing) {
    resetForm()
  } else if (result.data) {
    loadFromPack(result.data)
  }

  emit('saved')
}

function productById(id: string) {
  return props.products.find((p) => p.id === id) ?? null
}

function resetForm() {
  loadFromPack(props.pack ?? null)
}

function humanizeError(err: any) {
  if (!err) return null
  if (typeof err === 'string') return err
  if (err.message) return err.message
  return t('common.error') || 'Une erreur est survenue.'
}
</script>

<style scoped>
.input {
  @apply w-full rounded-lg border border-white/15 bg-black/30 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40;
}
</style>
