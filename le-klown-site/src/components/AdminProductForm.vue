<template>
  <form @submit.prevent="onSubmit" class="rounded-2xl bg-gray-800 p-5 md:p-6 shadow-xl space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h3 class="text-xl font-heading">
          {{ isEditing ? ($t('admin.editProduct') || 'Modifier un produit') : ($t('admin.addProduct') || 'Ajouter un produit') }}
        </h3>
        <p class="text-xs opacity-70 mt-1">* {{ $t('admin.required') || 'Champs obligatoires' }}</p>
      </div>
      <div v-if="isEditing" class="text-xs px-2 py-1 rounded bg-primary/20 text-primary border border-primary/40">
        ID #{{ core.id }}
      </div>
    </div>

    <section class="bg-backgroundDark/70 border border-light/10 rounded-xl p-4 space-y-4">
      <h4 class="text-lg font-semibold">{{ $t('admin.productInfos') || 'Informations produit' }}</h4>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm mb-1">Nom <span class="text-red-400">*</span></label>
          <input
            v-model.trim="core.name"
            class="w-full rounded-lg p-2 bg-backgroundDark border border-light/10 focus:outline-none focus:ring-2 focus:ring-primary/60"
            required
            placeholder="T-shirt Le KLOWN"
          />
          <p v-if="v.name" class="text-xs text-red-300 mt-1">{{ v.name }}</p>
        </div>
        <div>
          <label class="block text-sm mb-1">Prix (€) <span class="text-red-400">*</span></label>
          <input
            v-model.number="core.price"
            type="number"
            min="0"
            step="0.01"
            class="w-full rounded-lg p-2 bg-backgroundDark border border-light/10 focus:outline-none focus:ring-2 focus:ring-primary/60"
            required
          />
          <p v-if="v.price" class="text-xs text-red-300 mt-1">{{ v.price }}</p>
        </div>
        <div class="md:col-span-2">
          <label class="block text-sm mb-1">Description</label>
          <textarea
            v-model.trim="core.description"
            rows="3"
            class="w-full rounded-lg p-2 bg-backgroundDark border border-light/10"
          />
        </div>
        <div class="md:col-span-2 space-y-2">
          <label class="block text-sm mb-1">Images (URL) <span class="text-red-400">*</span></label>
          <div class="space-y-2">
            <div
              v-for="(value, index) in imageFields"
              :key="index"
              class="flex gap-2"
            >
              <input
                v-model.trim="imageFields[index]"
                class="flex-1 rounded-lg p-2 bg-backgroundDark border border-light/10"
                placeholder="https://.../image.jpg"
              />
              <button
                type="button"
                class="btn btn-red btn-sm"
                @click="removeImageField(index)"
                :disabled="imageFields.length === 1"
              >
                {{ $t('admin.removeImage') || 'Supprimer' }}
              </button>
            </div>
          </div>
        <div class="flex flex-wrap items-center gap-3">
          <button type="button" class="btn btn-secondary btn-sm" @click="addImageField">
            + {{ $t('admin.addImage') || 'Ajouter une image' }}
          </button>
          <p v-if="v.images" class="text-xs text-red-300">{{ v.images }}</p>
        </div>
        <p class="text-[11px] opacity-60">{{ $t('admin.imageUrlHint') || 'Saisis chaque URL d’image séparément.' }}</p>
          <div class="pt-1 space-y-1">
            <label class="block text-sm font-medium">{{ $t('admin.uploadImageLabel') || 'Téléverser une image (JPG/PNG)' }}</label>
            <input
              type="file"
              accept="image/png,image/jpeg"
              class="block w-full text-sm text-light/80 file:mr-3 file:py-1.5 file:px-3 file:rounded file:border-0 file:bg-primary/20 file:text-primary"
              :disabled="uploadingImage"
              @change="onUploadProductImage"
            />
            <p class="text-[11px] opacity-60">
              {{ $t('admin.uploadImageHelp', { bucket: bucketName }) || `Fichiers stockés dans ${bucketName}` }}
            </p>
            <p v-if="uploadingImage" class="text-xs text-primary">{{ $t('admin.uploadingImage') || 'Upload en cours…' }}</p>
            <p v-if="uploadImageError" class="text-xs text-red-400">{{ uploadImageError }}</p>
          </div>
        </div>
        <div class="flex items-center gap-2">
          <input id="deleted" type="checkbox" v-model="core.deleted" class="rounded accent-primary" />
          <label for="deleted" class="text-sm">Masquer (deleted)</label>
        </div>
        <div v-if="core.created_at" class="md:col-span-2 text-xs opacity-70">
          Créé le : {{ formatDateTime(core.created_at) }}
        </div>
      </div>
    </section>

    <section class="bg-backgroundDark/70 border border-light/10 rounded-xl p-4 space-y-4">
      <div class="flex items-center justify-between gap-3">
        <h4 class="text-lg font-semibold">{{ $t('admin.options') || 'Options' }}</h4>
        <button type="button" class="btn btn-secondary btn-sm" @click="addOptionGroup">
          + {{ $t('admin.addOption') || 'Ajouter une option' }}
        </button>
      </div>

      <p v-if="optionGroups.length === 0" class="text-xs opacity-70">
        {{ $t('admin.optionHint') || 'Ajoute des options (ex: Taille, Couleur) pour créer des variantes.' }}
      </p>

      <div
        v-for="group in optionGroups"
        :key="group.localId"
        class="border border-light/10 rounded-lg p-4 space-y-3 bg-backgroundDark/60"
      >
        <div>
          <label class="block text-sm mb-1">{{ $t('admin.optionLabel') || 'Libellé affiché' }}</label>
          <input v-model.trim="group.label" class="w-full rounded-lg p-2 bg-backgroundDark border border-light/10" />
        </div>
        <div class="flex flex-wrap items-center gap-4 text-sm">
          <label class="inline-flex items-center gap-2">
            <input type="checkbox" v-model="group.required" class="rounded accent-primary" />
            {{ $t('admin.optionRequired') || 'Option obligatoire' }}
          </label>
          <label class="inline-flex items-center gap-2">
            <input type="checkbox" v-model="group.multi" class="rounded accent-primary" />
            {{ $t('admin.optionMulti') || 'Plusieurs valeurs autorisées' }}
          </label>
        </div>

        <div class="space-y-2">
          <div class="flex items-center justify-between">
            <h5 class="text-sm font-semibold uppercase tracking-wide">{{ $t('admin.optionValues') || 'Valeurs' }}</h5>
            <button type="button" class="btn btn-white btn-sm" @click="addOptionValue(group)">
              + {{ $t('admin.addValue') || 'Ajouter une valeur' }}
            </button>
          </div>
          <p v-if="group.values.length === 0" class="text-xs opacity-60">
            {{ $t('admin.noValuesYet') || 'Aucune valeur définie.' }}
          </p>
          <div
            v-for="value in group.values"
            :key="value.localId"
            class="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-3 items-center"
          >
            <input
              v-model.trim="value.label"
              class="rounded-lg p-2 bg-backgroundDark border border-light/10"
              :placeholder="$t('admin.valueLabel') || 'Ex: S'"
            />
            <div class="flex items-center justify-end gap-2">
              <button type="button" class="btn btn-red btn-sm" @click="removeOptionValue(group, value)">
                {{ $t('common.delete') || 'Supprimer' }}
              </button>
            </div>
          </div>
        </div>

        <div class="flex justify-end">
          <button type="button" class="btn btn-red btn-sm" @click="removeOptionGroup(group)">
            {{ $t('admin.removeOption') || 'Supprimer l\'option' }}
          </button>
        </div>
      </div>
    </section>

    <section class="bg-backgroundDark/70 border border-light/10 rounded-xl p-4 space-y-4">
      <div class="flex flex-wrap items-center justify-between gap-3">
        <h4 class="text-lg font-semibold">{{ $t('admin.variants') || 'Variantes' }}</h4>
        <div class="flex flex-wrap gap-2 items-center">
          <button
            type="button"
            class="btn btn-white btn-sm"
            @click="generateVariants"
            :disabled="skuLoading || submitting"
          >
            {{ $t('admin.generateVariants') || 'Générer toutes les combinaisons' }}
          </button>
          <button
            type="button"
            class="btn btn-secondary btn-sm"
            @click="addVariant"
            :disabled="skuLoading || submitting"
          >
            + {{ $t('admin.addVariant') || 'Ajouter une variante' }}
          </button>
          <span v-if="skuLoading" class="text-xs text-light/60">
            {{ $t('admin.generatingSkus') || 'Génération des SKU…' }}
          </span>
        </div>
      </div>

      <p v-if="variants.length === 0" class="text-xs opacity-70">
        {{ $t('admin.variantHint') || 'Ajoute au moins une variante avec son stock.' }}
      </p>

      <div v-else class="overflow-x-auto">
        <table class="min-w-full text-sm">
          <thead>
            <tr class="text-left text-xs uppercase tracking-wide text-light/60">
              <th v-for="option in optionGroups" :key="option.localId" class="px-2 py-1">
                {{ option.label || option.code || 'Option' }}
              </th>
              <th class="px-2 py-1">Stock</th>
              <th class="px-2 py-1">Actif</th>
              <th class="px-2 py-1">SKU</th>
              <th class="px-2 py-1"></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="variant in variants" :key="variant.localId" class="border-t border-white/10">
              <td
                v-for="option in optionGroups"
                :key="`${variant.localId}-${option.localId}`"
                class="px-2 py-2"
              >
                <select
                  class="w-full rounded-lg p-2 bg-backgroundDark border border-light/10"
                  :value="variantValueForOption(variant, option.localId)"
                  @change="onVariantValueChange(variant, option.localId, $event)"
                >
                  <option value="">—</option>
                  <option
                    v-for="value in option.values"
                    :key="value.localId"
                    :value="value.localId"
                  >
                    {{ value.label || value.code }}
                  </option>
                </select>
              </td>
              <td class="px-2 py-2 align-middle">
                <input
                  type="number"
                  min="0"
                  v-model.number="variant.stock"
                  class="w-full rounded-lg p-2 bg-backgroundDark border border-light/10"
                />
              </td>
              <td class="px-2 py-2 align-middle">
                <label class="inline-flex items-center gap-2 text-xs">
                  <input type="checkbox" v-model="variant.isActive" class="rounded accent-primary" />
                  {{ variant.isActive ? ($t('common.yes') || 'Oui') : ($t('common.no') || 'Non') }}
                </label>
              </td>
              <td class="px-2 py-2 align-middle">
                <input
                  v-model.trim="variant.sku"
                  class="w-full rounded-lg p-2 bg-backgroundDark border border-light/10"
                  placeholder="SKU"
                />
              </td>
              <td class="px-2 py-2 align-middle text-right">
                <button type="button" class="btn btn-red btn-sm" @click="removeVariant(variant)">
                  {{ $t('common.delete') || 'Supprimer' }}
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <p v-if="variantError" class="text-xs text-red-300">{{ variantError }}</p>
    </section>

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
import { useI18n } from 'vue-i18n'
import { supabase } from '@/supabase/client'
import type { Product } from '@/composables/useProducts'
import { uploadImageToStorage, requiredBucketName } from '@/utils/storage'

interface OptionValueDraft {
  id?: string
  localId: string
  optionLocalId: string
  label: string
  code: string
  metadata: Record<string, any> | null
}

interface OptionGroupDraft {
  id?: string
  localId: string
  label: string
  code: string
  required: boolean
  multi: boolean
  values: OptionValueDraft[]
}

interface VariantDraft {
  id?: string
  localId: string
  optionValueLocalIds: string[]
  stock: number
  isActive: boolean
  sku?: string | null
}

const { t } = useI18n()

const props = defineProps<{ product: Product | null }>()
const emit = defineEmits<{ (e:'saved'): void }>()

const core = reactive({
  id: '' as string,
  name: '',
  description: '' as string | null,
  price: 0,
  images: [] as string[],
  deleted: false,
  created_at: '' as string,
})

const imageFields = ref<string[]>([''])
const optionGroups = ref<OptionGroupDraft[]>([])
const variants = ref<VariantDraft[]>([])

const groupsToDelete = ref(new Set<string>())
const valuesToDelete = ref(new Set<string>())
const variantsToDelete = ref(new Set<string>())

const submitting = ref(false)
const error = ref<string | null>(null)
const variantError = ref<string | null>(null)
const uploadingImage = ref(false)
const uploadImageError = ref<string | null>(null)
const skuLoading = ref(false)
const v = reactive<{ name?: string; price?: string; images?: string }>({})

const isEditing = computed(() => !!core.id)

watch(() => props.product, (p) => {
  void loadFromProduct(p)
}, { immediate: true })

const draftId = ref(uid())
const bucketName = requiredBucketName()
const productIdentifier = computed(() => core.id || draftId.value)

watch(imageFields, () => {
  const imgs = collectImages()
  core.images = imgs
  v.images = imgs.length > 0 ? '' : (t('admin.imageRequired') || 'Ajoute au moins une image.')
}, { deep: true })

async function loadFromProduct(product: Product | null) {
  core.id = product?.id ?? ''
  core.name = product?.name ?? ''
  core.description = product?.description ?? ''
  core.price = Number(product?.price ?? 0)
  core.images = Array.isArray(product?.images) ? [...(product?.images as string[])] : []
  core.deleted = !!product?.deleted
  core.created_at = product?.created_at ?? ''
  imageFields.value = core.images.length ? [...core.images] : ['']

  optionGroups.value = (product?.options ?? []).map((group) => ({
    id: group.id,
    localId: group.id,
    label: group.label ?? '',
    code: group.code ?? '',
    required: !!group.required,
    multi: !!group.multi,
    values: (group.values ?? []).map((value) => ({
      id: value.id,
      localId: value.id,
      optionLocalId: group.id,
      label: value.label ?? '',
      code: value.code ?? '',
      metadata: value.metadata ?? null,
    })),
  }))

  variants.value = (product?.variants ?? [])
    .filter((variant) => variant.deleted !== true)
    .map((variant) => ({
      id: variant.id,
      localId: variant.id,
      optionValueLocalIds: Array.isArray(variant.optionValueIds)
        ? variant.optionValueIds.map((id) => String(id))
        : [],
      stock: Number(variant.stock ?? 0),
      isActive: variant.isActive !== false,
      sku: variant.sku ?? null,
    }))

  groupsToDelete.value.clear()
  valuesToDelete.value.clear()
  variantsToDelete.value.clear()

  ensureDefaultVariant()

  draftId.value = core.id || uid()

  if (variants.value.length) {
    try {
      await ensureVariantSkusWithState(variants.value)
    } catch (err: any) {
      console.error('[AdminProductForm] loadFromProduct SKU error', err)
      error.value = err?.message || 'Impossible de générer un SKU unique.'
    }
  }
}

function reset() {
  if (props.product) void loadFromProduct(props.product)
  else void loadFromProduct(null)
  error.value = null
  variantError.value = null
  uploadImageError.value = null
  uploadingImage.value = false
  if (imageFields.value.length === 0) imageFields.value = ['']
}

function uid(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }
  return `tmp_${Math.random().toString(36).slice(2, 10)}`
}

function addOptionGroup() {
  optionGroups.value.push({
    localId: uid(),
    label: '',
    code: '',
    required: true,
    multi: false,
    values: [],
  })
}

function removeOptionGroup(group: OptionGroupDraft) {
  if (group.id) groupsToDelete.value.add(group.id)
  optionGroups.value = optionGroups.value.filter((g) => g.localId !== group.localId)
  // Remove variants using values from this group
  const lookup = valueLookup.value
  variants.value = variants.value.filter((variant) => {
    const usesGroup = variant.optionValueLocalIds.some((valueId) => lookup.get(valueId)?.optionLocalId === group.localId)
    if (usesGroup && variant.id) variantsToDelete.value.add(variant.id)
    return !usesGroup
  })
}

function addOptionValue(group: OptionGroupDraft) {
  group.values.push({
    localId: uid(),
    optionLocalId: group.localId,
    label: '',
    code: '',
    metadata: null,
  })
}

function removeOptionValue(group: OptionGroupDraft, value: OptionValueDraft) {
  if (value.id) valuesToDelete.value.add(value.id)
  group.values = group.values.filter((v) => v.localId !== value.localId)
  variants.value = variants.value.filter((variant) => {
    if (variant.optionValueLocalIds.includes(value.localId)) {
      if (variant.id) variantsToDelete.value.add(variant.id)
      return false
    }
    return true
  })
}

const valueLookup = computed(() => {
  const map = new Map<string, OptionValueDraft>()
  for (const group of optionGroups.value) {
    for (const value of group.values) {
      map.set(value.localId, value)
    }
  }
  return map
})

function ensureDefaultVariant() {
  if (variants.value.length > 0) return
  variants.value.push({
    localId: uid(),
    optionValueLocalIds: [],
    stock: 0,
    isActive: true,
    sku: null,
  })
  void ensureVariantSkusWithState(variants.value)
}

async function addVariant() {
  const newVariant: VariantDraft = {
    localId: uid(),
    optionValueLocalIds: [],
    stock: 0,
    isActive: true,
    sku: null,
  }

  for (const group of optionGroups.value) {
    const firstValue = group.values[0]
    if (firstValue) newVariant.optionValueLocalIds.push(firstValue.localId)
  }

  const next = [...variants.value, newVariant]
  try {
    await ensureVariantSkusWithState(next)
    variants.value = next
  } catch (err: any) {
    console.error('[AdminProductForm] addVariant error', err)
    error.value = err?.message || 'Impossible de générer un SKU unique.'
  }
}

function removeVariant(variant: VariantDraft) {
  if (variant.id) variantsToDelete.value.add(variant.id)
  variants.value = variants.value.filter((v) => v.localId !== variant.localId)
  ensureDefaultVariant()
}

function cartesianProduct<T>(arrays: T[][]): T[][] {
  if (arrays.length === 0) return [[]]
  return arrays.reduce<T[][]>((acc, cur) => {
    const result: T[][] = []
    for (const prefix of acc) {
      for (const value of cur) {
        result.push([...prefix, value])
      }
    }
    return result
  }, [[]])
}

async function generateVariants() {
  if (optionGroups.value.length === 0) {
    ensureDefaultVariant()
    return
  }
  for (const group of optionGroups.value) {
    if (group.values.length === 0) {
      const optionLabel = group.label || group.code || 'Option'
      variantError.value = t('admin.optionNeedsValue', { option: optionLabel }) || `Ajoute des valeurs pour ${optionLabel}.`
      return
    }
  }
  variantError.value = null

  const matrix = optionGroups.value.map((group) => group.values.map((value) => value.localId))
  const combos = cartesianProduct(matrix).map((combo) => combo.sort())

  const existingByKey = new Map<string, VariantDraft>()
  for (const variant of variants.value) {
    const key = variant.optionValueLocalIds.slice().sort().join('|')
    existingByKey.set(key, variant)
  }

  const nextVariants: VariantDraft[] = []
  for (const combo of combos) {
    const key = combo.join('|')
    const existing = existingByKey.get(key)
    if (existing) {
      nextVariants.push(existing)
    } else {
      nextVariants.push({
        localId: uid(),
        optionValueLocalIds: [...combo],
        stock: 0,
        isActive: true,
        sku: null,
      })
    }
  }

  for (const variant of variants.value) {
    const key = variant.optionValueLocalIds.slice().sort().join('|')
    if (!combos.some((combo) => combo.join('|') === key) && variant.id) {
      variantsToDelete.value.add(variant.id)
    }
  }

  try {
    await ensureVariantSkusWithState(nextVariants)
    variants.value = nextVariants
  } catch (err: any) {
    console.error('[AdminProductForm] generateVariants error', err)
    error.value = err?.message || 'Impossible de générer un SKU unique.'
  }
}

function variantValueForOption(variant: VariantDraft, optionLocalId: string) {
  const lookup = valueLookup.value
  const valueId = variant.optionValueLocalIds.find((localId) => lookup.get(localId)?.optionLocalId === optionLocalId)
  return valueId ?? ''
}

function setVariantValue(variant: VariantDraft, optionLocalId: string, valueLocalId: string) {
  const lookup = valueLookup.value
  variant.optionValueLocalIds = variant.optionValueLocalIds.filter((localId) => lookup.get(localId)?.optionLocalId !== optionLocalId)
  if (valueLocalId) variant.optionValueLocalIds.push(valueLocalId)
}

function onVariantValueChange(variant: VariantDraft, optionLocalId: string, event: Event) {
  const target = event.target as HTMLSelectElement
  setVariantValue(variant, optionLocalId, target.value)
}

const isValid = computed(() => validate())

function validate(): boolean {
  v.name = core.name ? '' : 'Le nom est requis.'
  v.price = Number(core.price) >= 0 ? '' : 'Le prix doit être ≥ 0.'
  const imgs = collectImages()
  v.images = imgs.length > 0 ? '' : (t('admin.imageRequired') || 'Ajoute au moins une image.')

  variantError.value = null
  if (variants.value.length === 0) {
    variantError.value = t('admin.variantNeedsOne') || 'Ajoute au moins une variante.'
  } else {
    const seen = new Set<string>()
    for (const variant of variants.value) {
      if (variant.stock < 0) {
        variantError.value = t('admin.variantStockPositive') || 'Le stock doit être ≥ 0 pour chaque variante.'
        break
      }
      for (const group of optionGroups.value) {
        if (group.required) {
          const has = variant.optionValueLocalIds.some((localId) => valueLookup.value.get(localId)?.optionLocalId === group.localId)
          if (!has) {
            const optionLabel = group.label || group.code || 'Option'
            variantError.value = t('admin.variantMissingOption', { option: optionLabel }) || `Chaque variante doit définir « ${optionLabel} ».`
            break
          }
        }
      }
      if (variantError.value) break
      const key = variant.optionValueLocalIds.slice().sort().join('|')
      if (seen.has(key) && optionGroups.value.length > 0) {
        variantError.value = t('admin.variantDuplicate') || 'Deux variantes partagent la même combinaison.'
        break
      }
      seen.add(key)
    }
  }

  return !v.name && !v.price && !v.images && !variantError.value
}

function collectImages() {
  return imageFields.value
    .map((value) => value.trim())
    .filter((value, index, array) => value.length > 0 && array.indexOf(value) === index)
}

function addImageField() {
  imageFields.value.push('')
  v.images = ''
}

function removeImageField(index: number) {
  if (imageFields.value.length <= 1) {
    imageFields.value[0] = ''
    v.images = t('admin.imageRequired') || 'Ajoute au moins une image.'
    return
  }
  imageFields.value.splice(index, 1)
  v.images = ''
}

async function onUploadProductImage(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return
  uploadImageError.value = null
  uploadingImage.value = true
  try {
    const url = await uploadImageToStorage(file, 'products', productIdentifier.value)
    const trimmed = url.trim()
    const emptyIndex = imageFields.value.findIndex((value) => value.trim() === '')
    if (emptyIndex >= 0) imageFields.value[emptyIndex] = trimmed
    else imageFields.value.push(trimmed)
    v.images = ''
  } catch (err: any) {
    uploadImageError.value = err?.message || 'Upload impossible.'
  } finally {
    uploadingImage.value = false
    input.value = ''
  }
}

function slugify(value: string) {
  return value
    .normalize('NFD')
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .toLowerCase()
}

function normalizeOptionCode(group: OptionGroupDraft) {
  if (!group.code && group.label) group.code = slugify(group.label)
  if (!group.code) group.code = `option_${optionGroups.value.indexOf(group) + 1}`
}

function normalizeValueCode(value: OptionValueDraft, index: number) {
  if (!value.code && value.label) value.code = slugify(value.label)
  if (!value.code) value.code = `value_${index + 1}`
}

const SKU_PREFIX = 'LK'
const SKU_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
const SKU_LENGTH = 6
const MAX_SKU_ATTEMPTS = 24

function normalizeSku(raw?: string | null): string | null {
  if (!raw) return null
  const trimmed = String(raw).trim().toUpperCase()
  return trimmed.length ? trimmed : null
}

async function ensureVariantSkusWithState(list: VariantDraft[]) {
  if (!list.length) return
  skuLoading.value = true
  try {
    await ensureVariantSkus(list)
  } finally {
    skuLoading.value = false
  }
}

async function ensureVariantSkus(list: VariantDraft[]) {
  const taken = new Set<string>()

  for (const variant of list) {
    const normalized = normalizeSku(variant.sku)
    if (normalized && !taken.has(normalized)) {
      const exists = await skuExists(normalized, variant.id ?? undefined)
      if (!exists) {
        variant.sku = normalized
        taken.add(normalized)
        continue
      }
    }

    const generated = await generateUniqueSku(taken, variant.id ?? undefined)
    variant.sku = generated
    taken.add(generated)
  }
}

function randomSkuBody() {
  let body = ''
  for (let i = 0; i < SKU_LENGTH; i += 1) {
    const idx = Math.floor(Math.random() * SKU_ALPHABET.length)
    body += SKU_ALPHABET[idx]
  }
  return body
}

async function generateUniqueSku(taken: Set<string>, exceptId?: string) {
  for (let attempt = 0; attempt < MAX_SKU_ATTEMPTS; attempt += 1) {
    const candidate = `${SKU_PREFIX}-${randomSkuBody()}`
    if (taken.has(candidate)) continue
    const exists = await skuExists(candidate, exceptId)
    if (!exists) return candidate
  }
  throw new Error('Impossible de générer un SKU unique. Réessaie.')
}

async function skuExists(sku: string, exceptId?: string) {
  let query = supabase
    .from('product_variants')
    .select('id')
    .eq('sku', sku)
    .limit(1)

  if (exceptId) {
    query = query.neq('id', exceptId)
  }

  const { data, error } = await query
  if (error) throw error
  const row = Array.isArray(data) ? data[0] : null
  return !!row
}

async function onSubmit() {
  error.value = null
  try {
    await ensureVariantSkusWithState(variants.value)
  } catch (err: any) {
    error.value = err?.message || 'Impossible de générer un SKU unique.'
    return
  }

  if (!isValid.value) {
    error.value = 'Merci de renseigner les champs obligatoires (*) et de compléter les variantes.'
    return
  }

  const images = collectImages()
  if (images.length === 0) {
    error.value = t('admin.imageRequired') || 'Ajoute au moins une image.'
    return
  }
  core.images = images

  submitting.value = true

  try {
    const payload = {
      name: core.name,
      description: core.description || null,
      price: Number(core.price) || 0,
      images,
      deleted: !!core.deleted,
    }

    let productId = core.id

    if (productId) {
      const { error: updateError } = await supabase.from('products').update(payload).eq('id', productId)
      if (updateError) throw updateError
    } else {
      const { data, error: insertError } = await supabase.from('products').insert(payload).select('id').single()
      if (insertError) throw insertError
      productId = data?.id
      if (!productId) throw new Error('Aucun ID produit retourné par Supabase.')
      core.id = productId
    }

    const { valueIdMap } = await persistOptions(productId)
    await persistVariants(productId, valueIdMap)

    emit('saved')
  } catch (err: any) {
    console.error('[AdminProductForm] onSubmit error', err)
    error.value = err?.message || 'Erreur lors de la sauvegarde.'
  } finally {
    submitting.value = false
  }
}

async function persistOptions(productId: string) {
  const optionIdMap = new Map<string, string>()
  const valueIdMap = new Map<string, { optionLocalId: string; optionId: string; valueId: string }>()

  for (const [index, group] of optionGroups.value.entries()) {
    normalizeOptionCode(group)
    const payload = {
      product_id: productId,
      code: group.code,
      label: group.label || group.code,
      required: group.required,
      multi: group.multi,
      sort_order: index,
    }

    if (group.id) {
      const { error: updateError } = await supabase
        .from('product_option_groups')
        .update(payload)
        .eq('id', group.id)
      if (updateError) throw updateError
      optionIdMap.set(group.localId, group.id)
    } else {
      const { data, error: insertError } = await supabase
        .from('product_option_groups')
        .insert(payload)
        .select('id')
        .single()
      if (insertError) throw insertError
      const newId = data?.id
      if (!newId) throw new Error('Création option: aucun ID retourné.')
      group.id = newId
      optionIdMap.set(group.localId, newId)
    }
  }

  if (groupsToDelete.value.size > 0) {
    const ids = Array.from(groupsToDelete.value)
    const { error: deleteError } = await supabase
      .from('product_option_groups')
      .delete()
      .in('id', ids)
    if (deleteError) throw deleteError
    groupsToDelete.value.clear()
  }

  for (const group of optionGroups.value) {
    const optionId = optionIdMap.get(group.localId)
    if (!optionId) continue
    group.values.forEach((value, idx) => normalizeValueCode(value, idx))
    for (const [index, value] of group.values.entries()) {
      const payload = {
        option_id: optionId,
        code: value.code,
        label: value.label || value.code,
        metadata: value.metadata ?? null,
        sort_order: index,
      }

      if (value.id) {
        const { error: updateError } = await supabase
          .from('product_option_values')
          .update(payload)
          .eq('id', value.id)
        if (updateError) throw updateError
        valueIdMap.set(value.localId, { optionLocalId: group.localId, optionId, valueId: value.id })
      } else {
        const { data, error: insertError } = await supabase
          .from('product_option_values')
          .insert(payload)
          .select('id')
          .single()
        if (insertError) throw insertError
        const newId = data?.id
        if (!newId) throw new Error('Création valeur option: aucun ID retourné.')
        value.id = newId
        valueIdMap.set(value.localId, { optionLocalId: group.localId, optionId, valueId: newId })
      }
    }
  }

  if (valuesToDelete.value.size > 0) {
    const ids = Array.from(valuesToDelete.value)
    const { error: deleteError } = await supabase
      .from('product_option_values')
      .delete()
      .in('id', ids)
    if (deleteError) throw deleteError
    valuesToDelete.value.clear()
  }

  return { optionIdMap, valueIdMap }
}

async function persistVariants(
  productId: string,
  valueIdMap: Map<string, { optionLocalId: string; optionId: string; valueId: string }>
) {
  const now = new Date().toISOString()

  const resolvedVariants = variants.value.map((variant) => {
    const mapped = variant.optionValueLocalIds
      .map((localId) => valueIdMap.get(localId))
      .filter((entry): entry is { optionLocalId: string; optionId: string; valueId: string } => !!entry)

    const optionValueIds = mapped.map((entry) => entry.valueId)
    const options = mapped.reduce<Record<string, string>>((acc, entry) => {
      acc[entry.optionId] = entry.valueId
      return acc
    }, {})

    return {
      ref: variant,
      payload: {
        product_id: productId,
        stock: Number(variant.stock) || 0,
        is_active: variant.isActive,
        sku: normalizeSku(variant.sku),
        deleted: false,
        updated_at: now,
        option_value_ids: optionValueIds.sort(),
        options,
      },
    }
  })

  for (const entry of resolvedVariants) {
    const { ref, payload } = entry
    if (ref.id) {
      const { error: updateError } = await supabase
        .from('product_variants')
        .update(payload)
        .eq('id', ref.id)
      if (updateError) throw updateError
    } else {
      const { data, error: insertError } = await supabase
        .from('product_variants')
        .insert(payload)
        .select('id')
        .single()
      if (insertError) throw insertError
      const newId = data?.id
      if (!newId) throw new Error('Création variante: aucun ID retourné.')
      ref.id = newId
    }
  }

  if (variantsToDelete.value.size > 0) {
    const ids = Array.from(variantsToDelete.value)
    const { error: deleteError } = await supabase
      .from('product_variants')
      .update({ deleted: true, updated_at: now })
      .in('id', ids)
    if (deleteError) throw deleteError
    variantsToDelete.value.clear()
  }
}

function formatDateTime(iso?: string) {
  if (!iso) return ''
  try {
    return new Date(iso).toLocaleString('fr-FR')
  } catch {
    return iso
  }
}
</script>

<style scoped>
.border-light\/10 { border-color: rgba(222,230,202,0.1); }
</style>
