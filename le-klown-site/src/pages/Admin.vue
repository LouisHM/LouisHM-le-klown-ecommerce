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
      <button
        @click="mode = 'orders'"
        :class="mode === 'orders' ? activeClass : inactiveClass"
      >
        {{ $t('admin.tabOrders') || 'Commandes' }}
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
    <section v-else-if="mode === 'products'" class="space-y-12">
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

    <!-- SECTION COMMANDES -->
    <section v-else class="space-y-6">
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h2 class="text-3xl font-heading">{{ $t('admin.ordersTitle') || 'Suivi des commandes' }}</h2>
        <div class="flex items-center gap-3">
          <button
            @click="toggleDeletedOrders"
            class="px-3 py-1 rounded-lg border border-light/20 hover:bg-light/10"
          >
            {{ showDeletedOrders ? ($t('admin.showActiveOrders') || 'Voir les commandes actives') : ($t('admin.showDeletedOrders') || 'Voir les commandes supprimées') }}
          </button>
          <button
            @click="fetchOrders"
            class="px-3 py-1 rounded-lg bg-primary text-light hover:bg-primary/80"
          >
            {{ $t('admin.refresh') || 'Rafraîchir' }}
          </button>
        </div>
      </div>

      <p class="text-sm opacity-70">{{ $t('admin.ordersHint') || 'Les commandes passent automatiquement en “Supprimée” si elles ne sont pas payées sous 48 h.' }}</p>

      <div v-if="ordersError" class="text-error text-sm">{{ ordersError }}</div>
      <div v-else-if="ordersLoading" class="text-sm opacity-70">{{ $t('common.loading') || 'Chargement…' }}</div>
      <div v-else-if="filteredOrders.length === 0" class="text-sm opacity-60">{{ showDeletedOrders ? ($t('admin.noDeletedOrders') || 'Aucune commande supprimée') : ($t('admin.noOrders') || 'Aucune commande à afficher') }}</div>

      <div v-else class="space-y-4">
        <article
          v-for="order in filteredOrders"
          :key="order.id"
          class="bg-backgroundDark/70 border border-light/10 rounded-xl p-5 space-y-4"
        >
          <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div>
              <p class="text-lg font-heading">{{ order.order_ref }}</p>
              <p class="text-sm opacity-70">{{ formatDate(order.created_at) }}</p>
              <p class="text-sm opacity-70">{{ formatOrderStatus(order.status) }}</p>
            </div>
            <div class="flex gap-2 flex-wrap">
              <button
                v-if="nextStatus(order)"
                @click="advanceOrderStatus(order)"
                class="px-3 py-1 rounded-lg bg-primary text-light hover:bg-primary/80"
              >
                {{ $t('admin.advanceStatus', { status: formatOrderStatus(nextStatus(order) || '') }) || `Marquer ${formatOrderStatus(nextStatus(order) || '')}` }}
              </button>
              <button
                v-if="!order.del_flag"
                @click="markOrderDeleted(order, true)"
                class="px-3 py-1 rounded-lg bg-red-600 text-light hover:bg-red-500"
              >
                {{ $t('admin.deleteOrder') || 'Supprimer' }}
              </button>
              <button
                v-else
                @click="markOrderDeleted(order, false)"
                class="px-3 py-1 rounded-lg border border-light/30 hover:bg-light/10"
              >
                {{ $t('admin.restoreOrder') || 'Restaurer' }}
              </button>
            </div>
          </div>

          <div class="grid md:grid-cols-2 gap-4 text-sm">
            <div class="space-y-1">
              <p class="font-semibold uppercase text-xs tracking-wide opacity-70">{{ $t('admin.customer') || 'Client' }}</p>
              <p>{{ order.customer_first_name }} {{ order.customer_last_name }}</p>
              <p>{{ order.customer_email }}</p>
              <p v-if="order.customer_phone">{{ order.customer_phone }}</p>
              <p v-if="order.customer_instagram">Instagram: {{ order.customer_instagram }}</p>
              <p>{{ order.customer_address }}</p>
              <p v-if="order.customer_notes" class="italic">{{ order.customer_notes }}</p>
            </div>
            <div class="space-y-1">
              <p class="font-semibold uppercase text-xs tracking-wide opacity-70">{{ $t('admin.statusTimeline') || 'Statuts' }}</p>
              <ul class="space-y-1">
                <li v-for="entry in buildStatusTimeline(order)" :key="entry.label" class="flex justify-between gap-2">
                  <span>{{ entry.label }}</span>
                  <span class="opacity-70">{{ entry.when }}</span>
                </li>
              </ul>
            </div>
          </div>

          <div class="space-y-2">
            <p class="font-semibold uppercase text-xs tracking-wide opacity-70">{{ $t('admin.items') || 'Articles' }}</p>
            <ul class="space-y-1 text-sm">
              <li v-for="item in parseOrderItems(order)" :key="item.key" class="flex justify-between gap-2">
                <span class="truncate">
                  {{ item.name }}
                  <template v-if="item.size">— {{ item.size }}</template>
                  × {{ item.quantity }}
                </span>
                <span>{{ formatPrice(item.total) }} €</span>
              </li>
            </ul>
            <div class="flex justify-end gap-3 text-sm font-semibold">
              <span>{{ $t('checkout.total') || 'Total' }}:</span>
              <span>{{ formatPrice(order.total_eur) }} €</span>
            </div>
          </div>
        </article>
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
import { useI18n } from 'vue-i18n'
import { supabase } from '@/supabase/client'
import EventCard from '@/components/EventCard.vue'
import AdminEventForm from '@/components/AdminEventForm.vue'
import AdminProductForm from '@/components/AdminProductForm.vue'
import EventModal from '@/components/EventModal.vue'
import { useProducts, type Product } from '@/composables/useProducts'
import { role, authReady, refreshSession } from '@/composables/useAuth'

const { locale } = useI18n()

// State
const mode = ref<'events' | 'products' | 'orders'>('events')
const events = ref<any[]>([])
const formEvent = ref<any|null>(null)
const modalEvent = ref<any|null>(null)
const selectedProduct = ref<Product|null>(null)
const showConfirm = ref(false)
const deleteError = ref<string | null>(null)
const eventFormContainer = ref<HTMLElement | null>(null)
const productFormContainer = ref<HTMLElement | null>(null)
let deleteTarget: { type: 'event'|'product'; id: any } | null = null

const orders = ref<OrderRecord[]>([])
const ordersLoading = ref(false)
const ordersError = ref<string | null>(null)
const showDeletedOrders = ref(false)

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
    await Promise.all([fetchEvents(), fetchProducts(), fetchOrders()])
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

watch(mode, async (value) => {
  if (value === 'orders' && role.value === 'admin' && orders.value.length === 0 && !ordersLoading.value) {
    await fetchOrders()
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

type OrderStatus = 'passée' | 'payée' | 'envoyée' | 'livrée'

type OrderItemSnapshot = {
  productId?: string | null
  name: string
  price: number
  quantity: number
  size?: string | null
  image?: string | null
}

type OrderRecord = {
  id: string
  order_ref: string
  user_id: string | null
  customer_email: string
  customer_first_name: string | null
  customer_last_name: string | null
  customer_address: string | null
  customer_phone: string | null
  customer_instagram: string | null
  customer_notes: string | null
  subtotal_eur: number
  shipping_eur: number
  total_eur: number
  items_snapshot: OrderItemSnapshot[] | string
  status: OrderStatus
  status_passed_at: string | null
  status_paid_at: string | null
  status_sent_at: string | null
  status_delivered_at: string | null
  del_flag: boolean
  created_at: string
  updated_at: string
}

const STATUS_SEQUENCE: OrderStatus[] = ['passée', 'payée', 'envoyée', 'livrée']
const statusLabels: Record<OrderStatus, string> = {
  passée: 'Passée',
  payée: 'Payée',
  envoyée: 'Envoyée',
  livrée: 'Livrée',
}

const filteredOrders = computed(() =>
  orders.value.filter(order => showDeletedOrders.value ? order.del_flag : !order.del_flag)
)

async function fetchOrders() {
  ordersLoading.value = true
  ordersError.value = null
  const { data, error } = await supabase
    .from('commandes')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    ordersError.value = error.message
  } else {
    orders.value = (data as OrderRecord[]) ?? []
  }
  ordersLoading.value = false
}

function toggleDeletedOrders() {
  showDeletedOrders.value = !showDeletedOrders.value
}

function nextStatus(order: OrderRecord): OrderStatus | null {
  const idx = STATUS_SEQUENCE.indexOf(order.status)
  if (idx === -1 || idx === STATUS_SEQUENCE.length - 1) return null
  return STATUS_SEQUENCE[idx + 1]
}

async function advanceOrderStatus(order: OrderRecord) {
  const next = nextStatus(order)
  if (!next) return

  const now = new Date().toISOString()
  const timestampField = next === 'payée' ? 'status_paid_at'
    : next === 'envoyée' ? 'status_sent_at'
    : next === 'livrée' ? 'status_delivered_at'
    : 'status_passed_at'

  const updates: Record<string, any> = {
    status: next,
    updated_at: now,
  }
  updates[timestampField] = now

  const { data, error } = await supabase
    .from('commandes')
    .update(updates)
    .eq('id', order.id)
    .eq('status', order.status)
    .select('*')
    .single<OrderRecord>()

  if (error) {
    ordersError.value = error.message
    return
  }

  ordersError.value = null
  orders.value = orders.value.map(o => o.id === order.id ? data : o)
}

async function markOrderDeleted(order: OrderRecord, delFlag: boolean) {
  const { data, error } = await supabase
    .from('commandes')
    .update({ del_flag: delFlag, updated_at: new Date().toISOString() })
    .eq('id', order.id)
    .select('*')
    .single<OrderRecord>()

  if (error) {
    ordersError.value = error.message
    return
  }

  ordersError.value = null
  orders.value = orders.value.map(o => o.id === order.id ? data : o)
}

function parseOrderItems(order: OrderRecord) {
  const value = order.items_snapshot
  let snapshot: OrderItemSnapshot[] = []
  if (Array.isArray(value)) {
    snapshot = value as OrderItemSnapshot[]
  } else if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value)
      if (Array.isArray(parsed)) snapshot = parsed as OrderItemSnapshot[]
    } catch (err) {
      console.warn('[Admin] unable to parse items_snapshot', err)
    }
  }

  return snapshot.map((item, index) => ({
    key: `${order.id}-${index}`,
    name: item.name ?? 'Article',
    size: item.size ?? null,
    quantity: Number(item.quantity) || 1,
    total: (Number(item.price) || 0) * (Number(item.quantity) || 1),
  }))
}

function buildStatusTimeline(order: OrderRecord) {
  return STATUS_SEQUENCE.map(status => ({
    label: statusLabels[status],
    when: formatDate(
      status === 'passée' ? order.status_passed_at
      : status === 'payée' ? order.status_paid_at
      : status === 'envoyée' ? order.status_sent_at
      : order.status_delivered_at
    ),
  }))
}

function formatDate(value: string | null) {
  if (!value) return '—'
  return new Date(value).toLocaleString(locale.value === 'fr' ? 'fr-FR' : 'en-GB')
}

function formatPrice(value: number) {
  return (Number(value) || 0).toFixed(2)
}

function formatOrderStatus(status: OrderStatus | '') {
  if (!status) return ''
  return statusLabels[status as OrderStatus] ?? status
}
</script>
