<template>
  <div class="pt-24 bg-dark text-light min-h-screen">
    <PromotionBanner :promos="['shop.promo.freeShipping']" />
    <div class="max-w-7xl mx-auto px-6 py-12">
      <h1 class="text-4xl font-heading mb-8 text-center">{{ $t('shop.title') }}</h1>

      <div v-if="isLoading" class="text-center">
        {{ $t('common.loading') || 'Chargement…' }}
      </div>
      <div v-else-if="globalError" class="text-center text-red-500">{{ globalError }}</div>
      <div v-else class="space-y-12">
        <section v-if="packs.length" class="space-y-6">
          <h2 class="text-2xl font-heading text-primary text-center md:text-left">
            {{ $t('shop.bundleTitle') || 'Packs exclusifs' }}
          </h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <PackCard
              v-for="pack in packs"
              :key="pack.id"
              :pack="pack"
            />
          </div>
        </section>

        <section class="space-y-6">
          <h2 class="text-2xl font-heading text-primary text-center md:text-left">
            {{ $t('shop.productsTitle') || 'Produits' }}
          </h2>
          <div
            v-if="products.length"
            class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            <ProductCard
              v-for="product in products"
              :key="product.id"
              :product="product"
            />
          </div>
          <p v-else class="text-center text-light/60">
            {{ $t('shop.empty') || 'Aucun produit disponible pour le moment.' }}
          </p>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useProducts } from '@/composables/useProducts'
import { usePacks } from '@/composables/usePacks'
import ProductCard from '@/components/ProductCard.vue'
import PackCard from '@/components/PackCard.vue'
import PromotionBanner from '@/components/PromotionBanner.vue'

const {
  products,
  loading: productsLoading,
  error: productsError,
  fetchProducts,
} = useProducts()

const {
  packs,
  loading: packsLoading,
  error: packsError,
  fetchPacks,
} = usePacks()

const isLoading = computed(() => productsLoading.value || packsLoading.value)
const globalError = computed(() => productsError.value || packsError.value)

onMounted(async () => {
  await Promise.all([fetchProducts(), fetchPacks()])
})
</script>
