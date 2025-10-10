<template>
  <form @submit.prevent="onSubmit" class="rounded-2xl bg-gray-800 p-5 md:p-6 shadow-xl space-y-5">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h3 class="text-xl font-heading">
          {{ isEditing ? ($t('admin.editEvent') || 'Modifier un événement') : ($t('admin.addEvent') || 'Ajouter un événement') }}
        </h3>
        <p class="text-xs opacity-70 mt-1">
          * {{ $t('admin.required') || 'Champs obligatoires' }}
        </p>
      </div>
      <div v-if="isEditing" class="text-xs px-2 py-1 rounded bg-primary/20 text-primary border border-primary/40">
        ID #{{ form.id }}
      </div>
    </div>

    <!-- Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <!-- nom -->
      <div class="md:col-span-1">
        <label class="block text-sm mb-1">Nom <span class="text-red-400">*</span></label>
        <input
          v-model.trim="form.nom"
          class="w-full rounded-lg p-2 bg-backgroundDark border border-light/10 focus:outline-none focus:ring-2 focus:ring-primary/60"
          required
          placeholder="Le KLOWN @ Festival ..."
        />
        <p v-if="v.nom" class="text-xs text-red-300 mt-1">{{ v.nom }}</p>
      </div>

      <!-- date -->
      <div class="md:col-span-1">
        <label class="block text-sm mb-1">Date <span class="text-red-400">*</span></label>
        <input
          v-model="form.date"
          type="date"
          class="w-full rounded-lg p-2 bg-backgroundDark border border-light/10 focus:outline-none focus:ring-2 focus:ring-primary/60"
          required
        />
        <p v-if="v.date" class="text-xs text-red-300 mt-1">{{ v.date }}</p>
      </div>

      <!-- lieu -->
      <div class="md:col-span-2">
        <label class="block text-sm mb-1">Lieu <span class="text-red-400">*</span></label>
        <input
          v-model.trim="form.lieu"
          class="w-full rounded-lg p-2 bg-backgroundDark border border-light/10"
          placeholder="Ville / salle / festival"
          required
        />
        <p v-if="v.lieu" class="text-xs text-red-300 mt-1">{{ v.lieu }}</p>
      </div>

      <!-- prix_debut -->
      <div class="md:col-span-1">
        <label class="block text-sm mb-1">Prix (à partir de) <span class="text-red-400">*</span></label>
        <input
          v-model.number="form.prix_debut"
          type="number" step="0.01" min="0"
          class="w-full rounded-lg p-2 bg-backgroundDark border border-light/10 focus:outline-none focus:ring-2 focus:ring-primary/60"
          required
          placeholder="0.00"
        />
        <p v-if="v.prix_debut" class="text-xs text-red-300 mt-1">{{ v.prix_debut }}</p>
      </div>

      <!-- image_url -->
      <div class="md:col-span-1 space-y-2">
        <label class="block text-sm mb-1">Images (URL) <span class="text-red-400">*</span></label>
        <div class="space-y-2">
          <div
            v-for="(value, index) in imageFields"
            :key="index"
            class="flex gap-2"
          >
            <input
              v-model.trim="imageFields[index]"
              type="url"
              class="flex-1 rounded-lg p-2 bg-backgroundDark border border-light/10"
              placeholder="https://.../affiche.jpg"
            />
            <button
              type="button"
              class="btn btn-red btn-sm"
              @click="removeEventImageField(index)"
              :disabled="imageFields.length === 1"
            >
              {{ $t('admin.removeImage') || 'Supprimer' }}
            </button>
          </div>
        </div>
        <div class="flex flex-wrap items-center gap-3">
          <button type="button" class="btn btn-secondary btn-sm" @click="addEventImageField">
            + {{ $t('admin.addImage') || 'Ajouter une image' }}
          </button>
          <p v-if="imageError" class="text-xs text-red-300">{{ imageError }}</p>
        </div>
        <p class="text-[11px] opacity-60">{{ $t('admin.imageUrlHint') || 'Saisis chaque URL d’image séparément.' }}</p>
        <div class="space-y-1">
          <label class="block text-sm font-medium">{{ $t('admin.uploadImageLabel') || 'Téléverser une image (JPG/PNG)' }}</label>
          <input
            type="file"
            accept="image/png,image/jpeg"
            class="block w-full text-sm text-light/80 file:mr-3 file:py-1.5 file:px-3 file:rounded file:border-0 file:bg-primary/20 file:text-primary"
            :disabled="uploadingImage"
            @change="onUploadEventImage"
          />
          <p class="text-[11px] opacity-60">
            {{ $t('admin.uploadImageHelp', { bucket: bucketName }) || `Fichiers stockés dans ${bucketName}` }}
          </p>
          <p v-if="uploadingImage" class="text-xs text-primary">{{ $t('admin.uploadingImage') || 'Upload en cours…' }}</p>
          <p v-if="uploadImageError" class="text-xs text-red-400">{{ uploadImageError }}</p>
        </div>
      </div>

      <!-- billeterie_url -->
      <div class="md:col-span-1">
        <label class="block text-sm mb-1">Billetterie (URL)</label>
        <input
          v-model.trim="form.billeterie_url"
          type="url"
          class="w-full rounded-lg p-2 bg-backgroundDark border border-light/10"
          placeholder="https://..."
        />
      </div>

      <!-- insta_url -->
      <div class="md:col-span-1">
        <label class="block text-sm mb-1">Instagram (URL)</label>
        <input
          v-model.trim="form.insta_url"
          type="url"
          class="w-full rounded-lg p-2 bg-backgroundDark border border-light/10"
          placeholder="https://instagram.com/..."
        />
      </div>

      <!-- description -->
      <div class="md:col-span-2">
        <label class="block text-sm mb-1">Description</label>
        <textarea
          v-model.trim="form.description"
          rows="3"
          class="w-full rounded-lg p-2 bg-backgroundDark border border-light/10"
          placeholder="Infos complémentaires (horaires, guests, etc.)"
        />
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
import { useI18n } from 'vue-i18n'
import { supabase } from '@/supabase/client'
import { uploadImageToStorage, requiredBucketName } from '@/utils/storage'

type DBEvent = {
  id?: number | string
  nom?: string
  lieu?: string
  date?: string
  description?: string
  image_url?: string | null
  prix_debut?: number | null
  billeterie_url?: string | null
  insta_url?: string | null
}

const props = defineProps<{ event: DBEvent | null }>()
const emit = defineEmits<{ (e:'saved'): void }>()
const { t } = useI18n()

// État du formulaire, aligné BDD
const form = reactive<Partial<DBEvent>>({
  id: undefined,
  nom: '',
  lieu: '',
  date: '',
  description: '',
  image_url: null,
  prix_debut: null,
  billeterie_url: null,
  insta_url: null,
})

const submitting = ref(false)
const error = ref<string | null>(null)
const uploadingImage = ref(false)
const uploadImageError = ref<string | null>(null)
const imageError = ref<string | null>(null)
const v = reactive<{ nom?: string; date?: string; lieu?: string; prix_debut?: string }>({})

const draftId = ref(uid())
const bucketName = requiredBucketName()
const imageFields = ref<string[]>([''])

watch(imageFields, () => {
  const imgs = collectEventImages()
  form.image_url = imgs.length ? JSON.stringify(imgs) : ''
  imageError.value = imgs.length > 0 ? null : (t('admin.imageRequired') || 'Ajoute au moins une image.')
}, { deep: true })

const isEditing = computed(() => form.id !== undefined && form.id !== null)

function toISODateOnly(val?: string) {
  if (!val) return ''
  // si jamais on reçoit un datetime ou une ISO longue, on tronque
  return val.length >= 10 ? val.slice(0, 10) : val
}

// Pré-remplissage depuis la prop (édition)
watch(() => props.event, (e) => {
  if (e) {
    Object.assign(form, {
      id: e.id ?? undefined,
      date: toISODateOnly(e.date || ''),
      lieu: e.lieu || '',
      image_url: e.image_url || '',
      billeterie_url: e.billeterie_url || '',
      insta_url: e.insta_url || '',
      prix_debut: e.prix_debut !== undefined && e.prix_debut !== null ? Number(e.prix_debut) : 0,
      description: e.description || '',
      nom: e.nom || ''
    })
    draftId.value = String(e.id ?? uid())
    const parsedImages = Array.isArray((e as any).images) && (e as any).images.length
      ? (e as any).images.map((value: any) => String(value).trim()).filter(Boolean)
      : parseEventImageField(e.image_url)
    imageFields.value = parsedImages.length ? [...parsedImages] : ['']
    form.image_url = parsedImages.length ? JSON.stringify(parsedImages) : ''
    imageError.value = null
  } else {
    reset()
  }
}, { immediate: true })

const isValid = computed(() => {
  v.nom = !form.nom ? 'Le nom est requis.' : undefined
  v.date = !form.date ? 'La date est requise.' : undefined
  v.lieu = !form.lieu ? 'Le lieu est requis.' : undefined
  v.prix_debut = (!isFinite(Number(form.prix_debut)) || Number(form.prix_debut) < 0)
    ? 'Le prix doit être un nombre ≥ 0.'
    : undefined
  const imgs = collectEventImages()
  imageError.value = imgs.length > 0 ? null : (t('admin.imageRequired') || 'Ajoute au moins une image.')
  return !v.nom && !v.date && !v.lieu && !v.prix_debut && !imageError.value
})

async function onUploadEventImage(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return
  uploadImageError.value = null
  uploadingImage.value = true
  try {
    const preferred = slugifyName(form.nom || '')
    const identifier = preferred || String(form.id ?? draftId.value)
    const url = await uploadImageToStorage(file, 'events', identifier)
    const trimmed = url.trim()
    const emptyIndex = imageFields.value.findIndex((value) => value.trim() === '')
    if (emptyIndex >= 0) imageFields.value[emptyIndex] = trimmed
    else imageFields.value.push(trimmed)
    const imgs = collectEventImages()
    form.image_url = imgs.length ? JSON.stringify(imgs) : ''
    imageError.value = null
  } catch (err: any) {
    uploadImageError.value = err?.message || 'Upload impossible.'
  } finally {
    uploadingImage.value = false
    input.value = ''
  }
}

function reset() {
  Object.assign(form, {
    id: undefined,
    date: '',
    lieu: '',
    image_url: '',
    billeterie_url: '',
    insta_url: '',
    prix_debut: 0,
    description: '',
    nom: ''
  })
  error.value = null
  uploadImageError.value = null
  uploadingImage.value = false
  imageError.value = null
  imageFields.value = ['']
  draftId.value = uid()
}

function uid(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }
  return `tmp_${Math.random().toString(36).slice(2, 10)}`
}

function collectEventImages() {
  return imageFields.value
    .map((value) => value.trim())
    .filter((value, index, array) => value.length > 0 && array.indexOf(value) === index)
}

function parseEventImageField(raw: unknown): string[] {
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

function addEventImageField() {
  imageFields.value.push('')
  imageError.value = null
}

function removeEventImageField(index: number) {
  if (imageFields.value.length <= 1) {
    imageFields.value[0] = ''
    imageError.value = t('admin.imageRequired') || 'Ajoute au moins une image.'
    return
  }
  imageFields.value.splice(index, 1)
  imageError.value = null
}

function slugifyName(value: string) {
  return value
    .normalize('NFD')
    .replace(/[^a-zA-Z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .toLowerCase()
}

async function onSubmit() {
  error.value = null
  if (!isValid.value) {
    error.value = 'Merci de remplir les champs obligatoires (*)'
    return
  }
  const images = collectEventImages()
  if (!images.length) {
    error.value = t('admin.imageRequired') || 'Ajoute au moins une image.'
    return
  }
  form.image_url = JSON.stringify(images)
  submitting.value = true
  try {
    const payload = {
      date: form.date,
      lieu: form.lieu,
      image_url: JSON.stringify(images),
      billeterie_url: form.billeterie_url || null,
      insta_url: form.insta_url || null,
      prix_debut: Number(form.prix_debut),
      description: form.description || null,
      nom: form.nom
    }

    const q = supabase.from('evenements')
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
