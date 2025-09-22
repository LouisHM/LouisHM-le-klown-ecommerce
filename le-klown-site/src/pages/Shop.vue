<template>
  <div class="pt-24 bg-dark text-light min-h-screen">
    <PromotionBanner :promos="['shop.promo.freeShipping']" />
    <div class="max-w-7xl mx-auto px-6 py-12">
      <h1 class="text-4xl font-heading mb-8 text-center">{{ $t('shop.title') }}</h1>

      <div v-if="loading" class="text-center">Loading…</div>
      <div v-else-if="error" class="text-center text-red-500">{{ error }}</div>
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        <ProductCard
          v-for="product in products"
          :key="product.id"
          :product="product"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useProducts } from '@/composables/useProducts'
import ProductCard from '@/components/ProductCard.vue'
import PromotionBanner from '@/components/PromotionBanner.vue'

const { products, loading, error, fetchProducts } = useProducts()

onMounted(() => {
  fetchProducts()
})
</script>
