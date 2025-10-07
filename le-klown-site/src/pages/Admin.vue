<template>
  <!-- Cas admin -->
  <div v-if="ready && role === 'admin'" class="pt-24 px-4 md:px-10 min-h-screen bg-dark text-light">
    <!-- Mini-nav secondaire -->
    <div class="flex space-x-4 justify-center">
      <button
        @click="mode = 'events'"
        :class="mode === 'events' ? activeClass : inactiveClass"
      >
        {{ $t('admin.tabEvents') }}
      </button>
      <button
        @click="mode = 'products'"
        :class="mode === 'products' ? activeClass : inactiveClass"
      >
        {{ $t('admin.tabProducts') }}
      </button>
    </div>

    <!-- SECTION ÉVÉNEMENTS -->
    <section v-if="mode === 'events'" class="space-y-12">
      <div ref="eventFormContainer">
        <AdminEventForm
          :key="formEvent?.id || 'new-event'"
          :event="formEvent"
          @saved="onEventSaved"
          class="max-w-3xl mx-auto"
        />
      </div>

      <!-- À venir -->
      <h2 class="text-3xl font-heading text-light uppercase mb-6 text-start">
        {{ $t('events.upcoming') }}
      </h2>
      <ul class="flex justify-center md:justify-start flex-wrap gap-4 mb-12">
        <li
          v-for="event in upcomingEvents"
          :key="event.id"
          class="relative"
          @click="openModal(event)"
        >
          <EventCard :event="event" class="pointer-events-none" />
          <div class="absolute top-2 right-2 z-50 flex gap-2 pointer-events-auto">
            <button
              @pointerdown.stop
              @click.stop.prevent="editEvent(event)"
              class="px-2 py-1 rounded-md bg-backgroundDark/80 border border-light/20 hover:bg-backgroundDark text-sm"
            >
              {{ $t('admin.edit') }}
            </button>
            <button
              @pointerdown.stop
              @click.stop.prevent="confirmDelete('event', event.id)"
              class="px-2 py-1 rounded-md bg-red-600/90 hover:bg-red-600 text-light text-sm"
            >
              {{ $t('admin.delete') }}
            </button>
          </div>
        </li>
      </ul>

      <!-- Passés -->
      <h2 class="text-3xl font-heading text-light uppercase mb-6 text-start">
        {{ $t('events.past') }}
      </h2>
      <ul class="flex justify-center md:justify-start flex-wrap gap-4">
        <li
          v-for="event in pastEvents"
          :key="event.id"
          class="relative grayscale opacity-60 hover:opacity-90 transition"
          @click="openModal(event)"
        >
          <EventCard :event="event" class="pointer-events-none" />
          <div class="absolute top-2 right-2 z-50 flex gap-2 pointer-events-auto">
            <button
              @pointerdown.stop
              @click.stop.prevent="editEvent(event)"
              class="px-2 py-1 rounded-md bg-backgroundDark/80 border border-light/20 hover:bg-backgroundDark text-sm"
            >
              {{ $t('admin.edit') }}
            </button>
            <button
              @pointerdown.stop
              @click.stop.prevent="confirmDelete('event', event.id)"
              class="px-2 py-1 rounded-md bg-red-600/90 hover:bg-red-600 text-light text-sm"
            >
              {{ $t('admin.delete') }}
            </button>
          </div>
        </li>
      </ul>

      <!-- Modal Détails -->
      <EventModal v-if="modalEvent" :event="modalEvent" @close="modalEvent = null" />
    </section>

    <!-- SECTION PRODUITS -->
    <section v-else class="space-y-12">
      <div ref="productFormContainer">
        <AdminProductForm
          :key="selectedProduct?.id || 'new-product'"
          :product="selectedProduct"
          @saved="onProductSaved"
          class="max-w-3xl mx-auto"
        />
      </div>

      <div>
        <h2 class="text-3xl font-heading text-primary mb-6">{{ $t('shop.title') }}</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="p in products"
            :key="p.id"
            class="bg-gray-800 p-4 rounded-lg flex flex-col border border-light/10"
          >
            <!-- Image principale -->
            <div class="relative aspect-[4/3] bg-backgroundDark rounded-md overflow-hidden">
              <img
                v-if="firstImage(p)"
                :src="firstImage(p) ?? undefined"
                alt=""
                class="w-full h-full object-cover"
                @error="onImgError($event)"
              />
              <div v-else class="w-full h-full grid place-items-center text-xs opacity-60">
                {{ $t('admin.noImage') || 'Aucune image' }}
              </div>
            </div>

            <h3 class="mt-3 font-semibold text-lg">{{ p.name }}</h3>
            <p class="text-sm text-gray-400 truncate">{{ p.description }}</p>
            <div class="mt-2 flex-1">
              <span class="font-bold">{{ (Number(p.price) || 0).toFixed(2) }} €</span>
              <span v-if="p.has_sizes" class="ml-2 text-sm">
                {{ $t('admin.sizes') }}: {{ (p.sizes || []).join(', ') }}
              </span>
            </div>

            <!-- Miniatures -->
            <div v-if="(p.images || []).length > 1" class="mt-2 flex gap-2 overflow-x-auto">
              <img
                v-for="(img, i) in p.images"
                :key="i"
                :src="img"
                class="w-12 h-12 rounded-md object-cover border border-light/10"
                alt=""
              />
            </div>

            <div class="flex gap-2 mt-4">
              <button
                @pointerdown.stop
                @click.stop.prevent="editProduct(p)"
                class="px-3 py-1 text-light border rounded hover:bg-light hover:text-dark transition"
              >
                {{ $t('admin.edit') }}
              </button>
              <button
                @pointerdown.stop
                @click.stop.prevent="confirmDelete('product', p.id)"
                class="px-3 py-1 bg-primary text-light rounded hover:opacity-90 transition"
              >
                {{ $t('admin.delete') }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Modal confirmation delete -->
    <div
      v-if="showConfirm"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-light text-dark p-6 rounded-lg shadow-lg space-y-4 w-[90%] max-w-md">
        <h2 class="text-2xl font-heading mb-2">{{ $t('admin.confirmDelete') }}</h2>
        <p v-if="deleteError" class="text-sm text-red-600">{{ deleteError }}</p>
        <div class="flex justify-end space-x-4 mt-6">
          <button
            @click="closeConfirm()"
            class="px-4 py-2 rounded border border-dark hover:bg-gray-200"
          >
            {{ $t('admin.cancel') }}
          </button>
          <button
            @click="performDelete"
            class="px-4 py-2 rounded bg-red-600 text-light hover:bg-dark"
          >
            {{ $t('admin.confirm') }}
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- Cas pas admin -->
  <div v-else-if="ready && role !== 'admin'" class="py-24 text-center">
    <h1 class="text-3xl font-heading mb-2">403</h1>
    <p class="opacity-70">{{ $t('admin.forbidden') || 'Accès réservé aux administrateurs.' }}</p>
  </div>

  <!-- Loading -->
  <div v-else class="py-24 text-center opacity-70">
    {{ $t('common.loading') || 'Chargement…' }}
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch, nextTick } from 'vue'
import { supabase } from '@/supabase/client'
import EventCard from '@/components/EventCard.vue'
import AdminEventForm from '@/components/AdminEventForm.vue'
import AdminProductForm from '@/components/AdminProductForm.vue'
import EventModal from '@/components/EventModal.vue'
import { useProducts, type Product } from '@/composables/useProducts'
import { role, authReady, refreshSession } from '@/composables/useAuth'

// State
const mode = ref<'events' | 'products'>('events')
const events = ref<any[]>([])
const formEvent = ref<any|null>(null)
const modalEvent = ref<any|null>(null)
const selectedProduct = ref<Product|null>(null)
const showConfirm = ref(false)
const deleteError = ref<string | null>(null)
const eventFormContainer = ref<HTMLElement | null>(null)
const productFormContainer = ref<HTMLElement | null>(null)
let deleteTarget: { type: 'event'|'product'; id: any } | null = null

// CSS classes
const activeClass   = 'px-4 py-2 rounded-t-lg bg-gray-800 text-light font-semibold'
const inactiveClass = 'px-4 py-2 rounded-t-lg bg-dark border border-light hover:bg-gray-700'

// Fetch events
async function fetchEvents() {
  const { data, error } = await supabase.from('evenements').select('*').order('date', { ascending: true })
  if (error) {
    console.error('[Admin] fetchEvents error:', error)
    return
  }
  events.value = data || []
}

function scrollToForm(section: 'events' | 'products') {
  const target = section === 'events' ? eventFormContainer.value : productFormContainer.value
  nextTick(() => {
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' })
    else window.scrollTo({ top: 0, behavior: 'smooth' })
  })
}

function editEvent(e: any) {
  mode.value = 'events'
  formEvent.value = { ...e }
  scrollToForm('events')
}

async function onEventSaved() {
  formEvent.value = null
  await fetchEvents()
  scrollToForm('events')
}

// Products
const { products, fetchProducts, deleteProduct } = useProducts()

function editProduct(p: Product) {
  mode.value = 'products'
  selectedProduct.value = { ...p }
  scrollToForm('products')
}

async function onProductSaved() {
  selectedProduct.value = null
  await fetchProducts()
  scrollToForm('products')
}

// Delete confirm
function confirmDelete(type: 'event'|'product', id: any) {
  deleteTarget = { type, id }
  showConfirm.value = true
  deleteError.value = null
}
function closeConfirm() {
  showConfirm.value = false
  deleteTarget = null
  deleteError.value = null
}

async function performDelete() {
  if (!deleteTarget) return
  deleteError.value = null

  try {
    if (deleteTarget.type === 'event') {
      const { error } = await supabase.from('evenements').delete().eq('id', deleteTarget.id)
      if (error) throw error
      await fetchEvents()
    } else {
      const { data, error } = await deleteProduct(deleteTarget.id)
      if (error) throw error
      if (!data || data.deleted !== true) {
        throw new Error('La suppression n’a pas été confirmée par Supabase.')
      }
      await fetchProducts()
    }
    closeConfirm()
  } catch (err: any) {
    console.error('[Admin] performDelete error:', err)
    const message = err?.message || err?.error_description || 'Suppression impossible.'
    deleteError.value = message
  }
}

// INIT
const ready = ref(false)

async function ensureAdminData() {
  if (role.value === 'admin') {
    await Promise.all([fetchEvents(), fetchProducts()])
  }
}

onMounted(async () => {
  if (!authReady.value) {
    await refreshSession()
  }

  ready.value = true
  await ensureAdminData()
})

watch(role, async (value, previous) => {
  if (value === 'admin' && previous !== 'admin' && ready.value) {
    await ensureAdminData()
  }
})

// Derived
const now = Date.now()
const upcomingEvents = computed(() => events.value.filter(e => new Date(e.date).getTime() >= now))
const pastEvents = computed(() => events.value.filter(e => new Date(e.date).getTime() < now).reverse())
function openModal(event: any) { modalEvent.value = event }

// Helpers
function firstImage(p: any): string | null {
  const imgs = Array.isArray(p?.images) ? p.images : []
  return imgs.find((u: string) => !!u) || null
}
function onImgError(ev: Event) { (ev.target as HTMLImageElement).style.display = 'none' }
</script>
