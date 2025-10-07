<template>
  <Navbar />

  <!-- Main routed content -->
  <RouterView />

  <!-- Footer + Contact -->
  <Footer @contact-click="showContact = true" />
  <ContactModal
    :visible="showContact"
    @close="showContact = false"
  />

  <!-- Cart controlled by App -->
  <Cart
    v-model:open="showCart"
    @checkout="openCheckout"
  />

  <!-- Checkout mounted globally so it appears above everything -->
  <CheckoutModal
    :visible="showCheckout"
    :cart-items="checkoutItems"
    @close="closeCheckout"
    @success="onOrderSuccess"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Navbar from '@/components/Navbar.vue'
import Footer from '@/components/Footer.vue'
import ContactModal from '@/components/ContactModal.vue'
import Cart from '@/components/Cart.vue'
import CheckoutModal from '@/components/CheckoutModal.vue'

type CartItem = {
  productId: string
  name: string
  price: number
  quantity: number
  size?: string
  image?: string
}

const showContact = ref(false)
const showCart = ref(false)
const showCheckout = ref(false)
const checkoutItems = ref<CartItem[]>([])

function openCheckout(items: CartItem[]) {
  checkoutItems.value = items
  showCart.value = false       // close cart so the checkout is visible
  showCheckout.value = true
}

function onOrderSuccess() {
  checkoutItems.value = []
}

function closeCheckout() {
  showCheckout.value = false
  checkoutItems.value = []
}
</script>
