<template>
  <!-- Cas admin -->
  <div v-if="ready && role === 'admin'" class="pt-24 px-4 md:px-10 min-h-screen bg-dark text-light">
    <div class="max-w-6xl mx-auto space-y-10">
      <!-- Mini-nav secondaire -->
      <div class="flex flex-wrap justify-center gap-2 md:gap-3">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          @click="mode = tab.id"
          :class="navBtnClass(tab.id)"
        >
          {{ tab.label }}
        </button>
      </div>

      <!-- SECTION ÉVÉNEMENTS -->
      <section v-if="mode === 'events'" class="space-y-8">
        <div
          ref="eventFormContainer"
          class="bg-backgroundDark/80 border border-light/10 rounded-2xl p-6 shadow-lg"
        >
          <AdminEventForm
            :key="formEvent?.id || 'new-event'"
            :event="formEvent"
            @saved="onEventSaved"
          />
        </div>

        <!-- À venir -->
        <div class="space-y-4">
          <h2 class="text-3xl font-heading uppercase tracking-widest">{{ $t('events.upcoming') }}</h2>
          <ul class="flex flex-wrap gap-4 justify-center md:justify-start">
          <li
            v-for="event in upcomingEvents"
            :key="event.id"
            class="relative"
            @click="openModal(event)"
          >
            <EventCard :event="event" class="cursor-pointer" />
            <div class="absolute top-3 right-3 flex gap-2 pointer-events-auto">
              <button
                @pointerdown.stop
                @click.stop.prevent="editEvent(event)"
                class="btn btn-secondary btn-sm"
              >
                {{ $t('admin.edit') }}
              </button>
              <button
                @pointerdown.stop
                @click.stop.prevent="confirmDelete('event', event.id)"
                class="btn btn-red btn-sm"
              >
                {{ $t('admin.delete') }}
              </button>
            </div>
          </li>
          </ul>
        </div>

        <div class="space-y-4">
          <h2 class="text-3xl font-heading uppercase tracking-widest">{{ $t('events.past') }}</h2>
          <ul class="flex flex-wrap gap-4 justify-center md:justify-start">
          <li
            v-for="event in pastEvents"
            :key="event.id"
            class="relative opacity-75 hover:opacity-100 transition"
            @click="openModal(event)"
          >
            <EventCard :event="event" class="cursor-pointer" />
            <div class="absolute top-3 right-3 flex gap-2 pointer-events-auto">
              <button
                @pointerdown.stop
                @click.stop.prevent="editEvent(event)"
                class="btn btn-secondary btn-sm"
              >
                {{ $t('admin.edit') }}
              </button>
              <button
                @pointerdown.stop
                @click.stop.prevent="confirmDelete('event', event.id)"
                class="btn btn-red btn-sm"
              >
                {{ $t('admin.delete') }}
              </button>
            </div>
          </li>
          </ul>
        </div>

        <EventModal v-if="modalEvent" :event="modalEvent" @close="modalEvent = null" />
      </section>

      <!-- SECTION PRODUITS -->
      <section v-else-if="mode === 'products'" class="space-y-8">
        <div
          ref="productFormContainer"
          class="bg-backgroundDark/80 border border-light/10 rounded-2xl p-6 shadow-lg"
        >
          <AdminProductForm
            :key="selectedProduct?.id || 'new-product'"
            :product="selectedProduct"
            @saved="onProductSaved"
          />
        </div>

        <div class="space-y-4">
          <h2 class="text-3xl font-heading uppercase tracking-widest text-primary">{{ $t('shop.title') }}</h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <article
              v-for="p in products"
              :key="p.id"
              class="bg-backgroundDark/70 border border-light/10 rounded-2xl p-6 flex flex-col gap-4 shadow-lg"
            >
              <div class="relative aspect-[4/3] rounded-xl overflow-hidden bg-dark/30">
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

              <div class="flex flex-col gap-2 text-sm text-light/80">
                <div>
                  <h3 class="text-lg font-semibold text-light">{{ p.name }}</h3>
                  <p class="line-clamp-2 opacity-80">{{ p.description }}</p>
                </div>
                <div class="flex items-center justify-between text-light">
                  <span class="font-bold">{{ (Number(p.price) || 0).toFixed(2) }} €</span>
                  <span class="text-xs text-light/70">
                    {{ $t('admin.totalStock') || 'Stock total' }} : {{ p.totalStock }}
                  </span>
                </div>

                <div class="text-xs text-light/60 space-y-1">
                  <div v-if="p.sizeOptions.length">
                    <span class="font-semibold">{{ $t('admin.sizes') || 'Tailles' }}:</span>
                    {{ p.sizeOptions.join(', ') }}
                  </div>
                  <div v-if="p.colorOptions.length">
                    <span class="font-semibold">{{ $t('admin.colors') || 'Couleurs' }}:</span>
                    {{ p.colorOptions.join(', ') }}
                  </div>
                </div>

                <div class="overflow-x-auto border border-white/10 rounded-lg" v-if="p.stocks.length">
                  <table class="min-w-full text-[11px] bg-black/20">
                    <thead>
                      <tr class="bg-black/40">
                        <th class="px-2 py-1 text-left">{{ $t('admin.size') || 'Taille' }}</th>
                        <th class="px-2 py-1 text-left">{{ $t('admin.color') || 'Couleur' }}</th>
                        <th class="px-2 py-1 text-right">{{ $t('admin.stock') || 'Stock' }}</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="entry in p.stocks" :key="entry.id" class="border-t border-white/10">
                        <td class="px-2 py-1">{{ entry.size || '—' }}</td>
                        <td class="px-2 py-1">{{ entry.color || '—' }}</td>
                        <td class="px-2 py-1 text-right font-semibold">{{ entry.stock }}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div v-if="(p.images || []).length > 1" class="flex gap-2 overflow-x-auto">
                <img
                  v-for="(img, i) in p.images"
                  :key="i"
                  :src="img"
                  class="w-12 h-12 rounded-lg object-cover border border-light/10"
                  alt=""
                />
              </div>

              <div class="flex flex-col sm:flex-row gap-2 mt-auto">
                <button
                  @pointerdown.stop
                  @click.stop.prevent="editProduct(p)"
                  class="btn btn-secondary w-full sm:flex-1"
                >
                  {{ $t('admin.edit') }}
                </button>
                <button
                  @pointerdown.stop
                  @click.stop.prevent="confirmDelete('product', p.id)"
                  class="btn btn-red w-full sm:flex-1"
                >
                  {{ $t('admin.delete') }}
                </button>
              </div>
            </article>
          </div>
        </div>
      </section>

      <!-- SECTION PACKS -->
      <section v-else-if="mode === 'packs'" class="space-y-8">
        <div
          ref="packFormContainer"
          class="bg-backgroundDark/80 border border-light/10 rounded-2xl p-6 shadow-lg"
        >
          <AdminPackForm
            :key="selectedPack?.id || 'new-pack'"
            :pack="selectedPack"
            :products="products"
            @saved="onPackSaved"
          />
        </div>

        <div class="space-y-4">
          <h2 class="text-3xl font-heading uppercase tracking-widest text-primary">
            {{ $t('admin.packsTitle') || 'Packs disponibles' }}
          </h2>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <article
              v-for="pk in packs"
              :key="pk.id"
              class="bg-backgroundDark/70 border border-light/10 rounded-2xl p-6 flex flex-col gap-4 shadow-lg"
            >
              <div class="relative aspect-[4/3] rounded-xl overflow-hidden bg-dark/30">
                <img
                  v-if="firstImage(pk)"
                  :src="firstImage(pk) ?? undefined"
                  alt=""
                  class="w-full h-full object-cover"
                  @error="onImgError($event)"
                />
                <div v-else class="w-full h-full grid place-items-center text-xs opacity-60">
                  {{ $t('admin.noImage') || 'Aucune image' }}
                </div>
              </div>

              <div class="flex flex-col gap-2 text-sm text-light/80">
                <div>
                  <h3 class="text-lg font-semibold text-light">{{ pk.name }}</h3>
                  <p class="line-clamp-2 opacity-80">{{ pk.description }}</p>
                </div>
                <div class="flex items-center justify-between text-light">
                  <span class="font-bold">{{ (Number(pk.price) || 0).toFixed(2) }} €</span>
                  <span class="text-xs text-light/70">
                    {{ $t('admin.packItemsCount', { count: pk.items.length }) || `${pk.items.length} produit(s)` }}
                  </span>
                </div>

                <ul class="text-xs text-light/70 space-y-1">
                  <li
                    v-for="item in pk.items"
                    :key="item.id"
                    class="flex justify-between gap-2"
                  >
                    <span class="truncate">
                      {{ item.product?.name || '#' + item.productId }}
                    </span>
                    <span class="text-light/50">× {{ item.quantity }}</span>
                  </li>
                </ul>
              </div>

              <div v-if="(pk.images || []).length > 1" class="flex gap-2 overflow-x-auto">
                <img
                  v-for="(img, i) in pk.images"
                  :key="i"
                  :src="img"
                  class="w-12 h-12 rounded-lg object-cover border border-light/10"
                  alt=""
                />
              </div>

              <div class="flex flex-col sm:flex-row gap-2 mt-auto">
                <button
                  @pointerdown.stop
                  @click.stop.prevent="editPack(pk)"
                  class="btn btn-secondary w-full sm:flex-1"
                >
                  {{ $t('admin.edit') }}
                </button>
                <button
                  @pointerdown.stop
                  @click.stop.prevent="confirmDelete('pack', pk.id)"
                  class="btn btn-red w-full sm:flex-1"
                >
                  {{ $t('admin.delete') }}
                </button>
              </div>
            </article>
          </div>
        </div>
      </section>

    <!-- SECTION COMMANDES -->
      <section v-else class="space-y-6">
        <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <h2 class="text-3xl font-heading uppercase tracking-widest">{{ $t('admin.ordersTitle') || 'Suivi des commandes' }}</h2>
          <div class="flex flex-col sm:flex-row sm:items-center gap-3">
            <label class="flex items-center gap-2 text-sm text-light/70">
              <span>{{ $t('admin.statusFilterLabel') || 'Filtrer' }} :</span>
              <select
                v-model="statusFilter"
                class="bg-backgroundDark border border-light/20 rounded-full px-3 py-1.5 text-sm focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondaryLight"
              >
                <option v-for="opt in statusOptions" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
              </select>
            </label>
            <div class="flex items-center gap-3">
              <button
                @click="toggleDeletedOrders"
                class="btn btn-secondary"
              >
                {{ showDeletedOrders ? ($t('admin.showActiveOrders') || 'Voir les commandes actives') : ($t('admin.showDeletedOrders') || 'Voir les commandes supprimées') }}
              </button>
              <button
                @click="fetchOrders"
                class="btn btn-white"
              >
                {{ $t('admin.refresh') || 'Rafraîchir' }}
              </button>
            </div>
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
          class="bg-backgroundDark/80 border border-light/10 rounded-2xl p-6 space-y-4 shadow-lg"
        >
          <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div>
              <p class="text-lg font-heading">{{ order.order_ref }}</p>
              <p class="text-sm opacity-70">{{ formatDate(order.created_at) }}</p>
              <p class="text-sm opacity-70">{{ formatOrderStatus(order.status) }}</p>
            </div>
            <div class="flex gap-2 flex-wrap">
              <button
                v-if="prevStatus(order)"
                @click="revertOrderStatus(order)"
                class="btn btn-secondary btn-sm"
              >
                {{ $t('admin.revertStatus', { status: formatOrderStatus(prevStatus(order) || '') }) || `Revenir à ${formatOrderStatus(prevStatus(order) || '')}` }}
              </button>
              <button
                v-if="nextStatus(order)"
                @click="advanceOrderStatus(order)"
                class="btn btn-white btn-sm"
              >
                {{ $t('admin.advanceStatus', { status: formatOrderStatus(nextStatus(order) || '') }) || `Marquer ${formatOrderStatus(nextStatus(order) || '')}` }}
              </button>
              <button
                v-if="!order.del_flag"
                @click="markOrderDeleted(order, true)"
                class="btn btn-red btn-sm"
              >
                {{ $t('admin.deleteOrder') || 'Supprimer' }}
              </button>
              <button
                v-else
                @click="markOrderDeleted(order, false)"
                class="btn btn-secondary btn-sm"
              >
                {{ $t('admin.restoreOrder') || 'Restaurer' }}
              </button>
            </div>
          </div>

          <div class="grid md:grid-cols-2 gap-4 text-sm">
            <div class="space-y-1 bg-backgroundDark/60 border border-light/10 rounded-xl p-4">
              <p class="text-xs uppercase tracking-[0.25em] font-semibold opacity-70">{{ $t('admin.customer') || 'Client' }}</p>
              <p>{{ order.customer_first_name }} {{ order.customer_last_name }}</p>
              <p>{{ order.customer_email }}</p>
              <p v-if="order.customer_phone">{{ order.customer_phone }}</p>
              <p v-if="order.customer_instagram">Instagram: {{ order.customer_instagram }}</p>
              <p>{{ order.customer_address }}</p>
              <p v-if="order.customer_notes" class="italic opacity-80">{{ order.customer_notes }}</p>
            </div>
            <div class="space-y-1 bg-backgroundDark/60 border border-light/10 rounded-xl p-4">
              <p class="text-xs uppercase tracking-[0.25em] font-semibold opacity-70">{{ $t('admin.statusTimeline') || 'Statuts' }}</p>
              <ul class="space-y-1">
                <li v-for="entry in buildStatusTimeline(order)" :key="entry.label" class="flex justify-between gap-2">
                  <span>{{ entry.label }}</span>
                  <span class="opacity-70">{{ entry.when }}</span>
                </li>
              </ul>
            </div>
          </div>

          <div class="space-y-2">
            <p class="text-xs uppercase tracking-[0.25em] font-semibold opacity-70">{{ $t('admin.items') || 'Articles' }}</p>
            <ul class="space-y-1 text-sm">
              <li v-for="item in parseOrderItems(order)" :key="item.key" class="flex justify-between gap-2">
                <span class="truncate">
                  {{ item.name }}
                  <template v-if="item.optionsText">— {{ item.optionsText }}</template>
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

    </div>

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
import AdminPackForm from '@/components/AdminPackForm.vue'
import EventModal from '@/components/EventModal.vue'
import { useProducts, type Product } from '@/composables/useProducts'
import { usePacks, type Pack } from '@/composables/usePacks'
import { normalizeEventRow, type EventRecord } from '@/composables/useEvents'
import { role, authReady, refreshSession } from '@/composables/useAuth'

const { t, locale } = useI18n()

type AdminTab = 'events' | 'products' | 'packs' | 'orders'

// State
const mode = ref<AdminTab>('events')
const events = ref<EventRecord[]>([])
const formEvent = ref<Record<string, any> | null>(null)
const modalEvent = ref<EventRecord | null>(null)
const selectedProduct = ref<Product | null>(null)
const selectedPack = ref<Pack | null>(null)
const showConfirm = ref(false)
const deleteError = ref<string | null>(null)
const eventFormContainer = ref<HTMLElement | null>(null)
const productFormContainer = ref<HTMLElement | null>(null)
const packFormContainer = ref<HTMLElement | null>(null)
let deleteTarget: { type: 'event'|'product'|'pack'; id: any } | null = null

const orders = ref<OrderRecord[]>([])
const ordersLoading = ref(false)
const ordersError = ref<string | null>(null)
const showDeletedOrders = ref(false)
const statusFilter = ref<'all' | OrderStatus>('all')

const tabs = computed(() => ([
  { id: 'events' as AdminTab, label: t('admin.tabEvents') },
  { id: 'products' as AdminTab, label: t('admin.tabProducts') },
  { id: 'packs' as AdminTab, label: t('admin.tabPacks') || 'Packs' },
  { id: 'orders' as AdminTab, label: t('admin.tabOrders') || 'Commandes' },
]))

const navBtnBase = 'px-4 py-2 rounded-full border text-sm md:text-base font-semibold transition-colors duration-200';
function navBtnClass(tab: AdminTab) {
  const isActive = mode.value === tab
  return [
    navBtnBase,
    isActive
      ? 'bg-primary text-light shadow-lg border-primary/70'
      : 'bg-white/10 text-light/70 hover:text-light hover:bg-white/20 border-white/10'
  ].join(' ')
}

const statusOptions = computed(() => ([
  { value: 'all', label: t('admin.statusAll') || 'Tous les statuts' },
  { value: 'passée', label: statusLabels['passée'] },
  { value: 'payée', label: statusLabels['payée'] },
  { value: 'envoyée', label: statusLabels['envoyée'] },
  { value: 'livrée', label: statusLabels['livrée'] },
] as Array<{ value: 'all' | OrderStatus; label: string }>))

// Fetch events
async function fetchEvents() {
  const { data, error } = await supabase.from('evenements').select('*').order('date', { ascending: true })
  if (error) {
    console.error('[Admin] fetchEvents error:', error)
    return
  }
  events.value = (data ?? []).map(normalizeEventRow)
}

function scrollToForm(section: 'events' | 'products' | 'packs') {
  let target: HTMLElement | null | undefined
  if (section === 'events') target = eventFormContainer.value
  else if (section === 'products') target = productFormContainer.value
  else target = packFormContainer.value

  nextTick(() => {
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' })
    else window.scrollTo({ top: 0, behavior: 'smooth' })
  })
}

function editEvent(e: EventRecord) {
  mode.value = 'events'
  formEvent.value = { ...e, images: e.images }
  scrollToForm('events')
}

async function onEventSaved() {
  formEvent.value = null
  await fetchEvents()
  scrollToForm('events')
}

// Products
const { products, fetchProducts, deleteProduct } = useProducts()
const { packs, fetchPacks, deletePack } = usePacks()

function editProduct(p: Product) {
  mode.value = 'products'
  selectedProduct.value = JSON.parse(JSON.stringify(p)) as Product
  scrollToForm('products')
}

async function onProductSaved() {
  selectedProduct.value = null
  await Promise.all([fetchProducts(), fetchPacks()])
  scrollToForm('products')
}

// Packs
function editPack(p: Pack) {
  mode.value = 'packs'
  selectedPack.value = JSON.parse(JSON.stringify(p)) as Pack
  scrollToForm('packs')
}

async function onPackSaved() {
  selectedPack.value = null
  await Promise.all([fetchPacks(), fetchProducts()])
  scrollToForm('packs')
}

// Delete confirm
function confirmDelete(type: 'event'|'product'|'pack', id: any) {
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
    } else if (deleteTarget.type === 'product') {
      const { error } = await deleteProduct(deleteTarget.id)
      if (error) throw error
      await fetchProducts()
    } else if (deleteTarget.type === 'pack') {
      const { error } = await deletePack(deleteTarget.id)
      if (error) throw error
      await fetchPacks()
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
    await Promise.all([fetchEvents(), fetchProducts(), fetchPacks(), fetchOrders()])
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
  if (value === 'packs' && role.value === 'admin' && packs.value.length === 0) {
    await fetchPacks()
  }
})

// Derived
const now = Date.now()
const upcomingEvents = computed(() => events.value.filter(e => new Date(e.date).getTime() >= now))
const pastEvents = computed(() => events.value.filter(e => new Date(e.date).getTime() < now).reverse())
function openModal(event: EventRecord) { modalEvent.value = event }

// Helpers
function firstImage(p: any): string | null {
  const imgs = Array.isArray(p?.images) ? p.images : []
  return imgs.find((u: string) => !!u) || null
}
function onImgError(ev: Event) { (ev.target as HTMLImageElement).style.display = 'none' }

type OrderStatus = 'passée' | 'payée' | 'envoyée' | 'livrée'

type OrderItemSnapshot = {
  productId?: string | null
  variant_id?: string | null
  name: string
  price: number
  quantity: number
  size?: string | null
  options?: Array<{
    optionId?: string | null
    optionLabel?: string | null
    valueId?: string | null
    valueLabel?: string | null
  } | Record<string, any>>
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
  orders.value.filter(order => {
    if (showDeletedOrders.value) {
      if (!order.del_flag) return false
    } else if (order.del_flag) return false

    if (statusFilter.value !== 'all' && order.status !== statusFilter.value) return false
    return true
  })
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

function prevStatus(order: OrderRecord): OrderStatus | null {
  const idx = STATUS_SEQUENCE.indexOf(order.status)
  if (idx <= 0) return null
  return STATUS_SEQUENCE[idx - 1]
}

function coerceOrderRecord(payload: any): OrderRecord | null {
  if (!payload) return null
  if (Array.isArray(payload)) return (payload[0] ?? null) as OrderRecord | null
  if (typeof payload === 'object') {
    if ('order' in payload && payload.order) return payload.order as OrderRecord
    if ('data' in payload && payload.data) return payload.data as OrderRecord
    return payload as OrderRecord
  }
  return null
}

async function callOrderRpc(functionName: string, params: Record<string, any>): Promise<OrderRecord> {
  const { data, error } = await supabase.rpc(functionName, params)
  if (error) throw error
  const order = coerceOrderRecord(data)
  if (!order) throw new Error('Aucune commande retournée par le serveur.')
  return order
}

function applyOrderUpdate(order: OrderRecord) {
  orders.value = orders.value.map(o => o.id === order.id ? order : o)
}

function handleOrderError(err: any) {
  console.error('[Admin] order RPC error', err)
  ordersError.value = err?.message || err?.error_description || 'Action impossible.'
}

async function advanceOrderStatus(order: OrderRecord) {
  const next = nextStatus(order)
  if (!next) return

  try {
    const updated = await callOrderRpc('advance_order_status', {
      order_id: order.id,
      current_status: order.status,
      next_status: next,
    })
    ordersError.value = null
    applyOrderUpdate(updated)
  } catch (err: any) {
    handleOrderError(err)
  }
}

async function revertOrderStatus(order: OrderRecord) {
  const previous = prevStatus(order)
  if (!previous) return

  try {
    const updated = await callOrderRpc('revert_order_status', {
      order_id: order.id,
      current_status: order.status,
      previous_status: previous,
    })
    ordersError.value = null
    applyOrderUpdate(updated)
  } catch (err: any) {
    handleOrderError(err)
  }
}

async function markOrderDeleted(order: OrderRecord, delFlag: boolean) {
  try {
    const updated = await callOrderRpc('mark_order_deleted', {
      order_id: order.id,
      del_flag: delFlag,
    })
    ordersError.value = null
    applyOrderUpdate(updated)
  } catch (err: any) {
    handleOrderError(err)
  }
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

  return snapshot.map((item, index) => {
    const quantity = Number(item.quantity) || 1
    const optionsText = resolveItemOptions(item)
    return {
      key: `${order.id}-${index}`,
      name: item.name ?? 'Article',
      optionsText,
      quantity,
      total: (Number(item.price) || 0) * quantity,
    }
  })
}

function resolveItemOptions(item: OrderItemSnapshot): string | null {
  const labels: string[] = []
  const rawOptions = (item as any).options

  if (Array.isArray(rawOptions)) {
    for (const entry of rawOptions) {
      if (entry && typeof entry === 'object') {
        const optionLabel = (entry as any).optionLabel || (entry as any).optionId || ''
        const valueLabel = (entry as any).valueLabel || (entry as any).valueId || ''
        if (optionLabel && valueLabel) labels.push(`${optionLabel}: ${valueLabel}`)
        else if (valueLabel) labels.push(valueLabel)
      }
    }
  }

  if (!labels.length && item.size) labels.push(item.size)

  return labels.length ? labels.join(', ') : null
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
