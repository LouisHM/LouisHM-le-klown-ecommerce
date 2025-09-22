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
      <div class="md:col-span-1">
        <label class="block text-sm mb-1">Image (URL)</label>
        <input
          v-model.trim="form.image_url"
          type="url"
          class="w-full rounded-lg p-2 bg-backgroundDark border border-light/10"
          placeholder="https://.../affiche.jpg"
        />
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
        class="px-5 py-2 rounded-xl bg-primary text-dark font-semibold disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {{ submitting ? ($t('admin.saving') || 'Enregistrement…') : (isEditing ? ($t('admin.save') || 'Enregistrer') : ($t('admin.add') || 'Ajouter')) }}
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import { supabase } from '@/supabase/client'

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
const v = reactive<{ nom?: string; date?: string; lieu?: string; prix_debut?: string }>({})

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
  return !v.nom && !v.date && !v.lieu && !v.prix_debut
})

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
}

async function onSubmit() {
  error.value = null
  if (!isValid.value) {
    error.value = 'Merci de remplir les champs obligatoires (*)'
    return
  }
  submitting.value = true
  try {
    const payload = {
      date: form.date,
      lieu: form.lieu,
      image_url: form.image_url || null,
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
.bg-primary { background:#9ecdf1; }
.bg-dark { background:#2b2729; }
.text-light { color:#dee6ca; }
.bg-backgroundDark { background:#1f1c1d; }
.border-light\/10 { border-color: rgba(222,230,202,0.1); }
</style>
