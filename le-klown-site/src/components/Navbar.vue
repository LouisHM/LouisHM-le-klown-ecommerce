<template>
<header
  :class="[
    'fixed top-0 left-0 w-full z-50 duration-500 animate-fade-in',
    showNavbar ? 'translate-y-0' : '-translate-y-full',
    isScrolled ? 'bg-dark shadow-md' : '',
    isOpen ? 'bg-dark' : ''
  ]"
>

    <nav class="max-w-7xl mx-auto flex justify-between items-center p-4">
      <!-- Logo -->
      <div class="flex items-center text-3xl font-heading tracking-wide">
        <img src="../../public/assets/img/logo-klown.png" alt="LE KLOWN" width="50" class="inline-block mr-2" />
        <span class="text-light text-">LE KLOWN</span>
      </div>

      <!-- Desktop navigation -->
      <div class="hidden lg:flex justify-center gap-4 text-base flex-1">
        <RouterLink
          v-for="item in filteredLinks"
          :key="item.path"
          :to="item.path"
          class="relative px-4 py-1 group"
        >
          {{ $t(item.label) }}
          <span
            class="pointer-events-none absolute -top-1 left-0 h-[3px] bg-red-600 transition-all duration-300"
            :class="{
              'w-full': $route.path === item.path,
              'w-0 group-hover:w-full': $route.path !== item.path
            }"
          ></span>
        </RouterLink>
        <!-- Bouton panier -->

<!-- Composant Cart -->
<Cart v-if="showCart" :open="showCart" @close="showCart = false" />
      </div>

      <!-- Right zone: Auth & Lang -->
      <div class="hidden lg:flex items-center gap-4 ml-4">
        <AuthButton @auth-changed="updateUserRole" />
        <div class="relative">
          <button @click="langMenu = !langMenu" class="flex items-center px-3 py-1 rounded-full hover:bg-gray-700 transition focus:outline-none text-sm">
            <span v-if="$i18n.locale === 'fr'">🇫🇷</span>
            <span v-else>🇬🇧</span>
            <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
            </svg>
          </button>
          <div v-if="langMenu" class="absolute right-0 mt-2 bg-dark text-light rounded shadow-md z-50">
            <button @click="changeLang('fr')" class="block w-full text-center px-4 py-2 hover:bg-gray-700 transition">🇫🇷</button>
            <button @click="changeLang('en')" class="block w-full text-center px-4 py-2 hover:bg-gray-700 transition">🇬🇧</button>
          </div>
        </div>
      </div>
    <!-- Burger menu -->
    <button @click="isOpen = !isOpen" class="lg:hidden focus:outline-none relative w-8 h-8 z-50 group">
      <span
        :class="[
          'block absolute h-[3px] w-full bg-light transition-all duration-300 ease-in-out',
          isOpen ? 'rotate-45 top-3.5' : 'top-1'
        ]"
      ></span>
      <span
        :class="[
          'block absolute h-[3px] w-full bg-light transition-all duration-300 ease-in-out',
          isOpen ? 'opacity-0' : 'top-3.5'
        ]"
      ></span>
      <span
        :class="[
          'block absolute h-[3px] w-full bg-light transition-all duration-300 ease-in-out',
          isOpen ? '-rotate-45 bottom-3.5' : 'bottom-1'
        ]"
      ></span>
    </button>

    </nav>

    <!-- Mobile menu -->
    <div v-if="isOpen" class="md:hidden bg-dark flex flex-col py-6 space-y-4 items-center text-base">
      <div v-for="item in filteredLinks" :key="item.path" class="relative w-full text-center">
        <RouterLink 
          :to="item.path"
          class="relative px-4 py-2 group inline-block"
          @click="isOpen = false"
        >
          {{ $t(item.label) }}
          <span
            class="pointer-events-none absolute -top-1 left-0 h-[3px] bg-red-600 transition-all duration-300"
            :class="{
              'w-full': $route.path === item.path,
              'w-0 group-hover:w-full': $route.path !== item.path
            }"
          ></span>
        </RouterLink>
      </div>

      <AuthButton @auth-changed="updateUserRole" />

      <div class="flex space-x-4 mt-4">
        <button @click="changeLang('fr')" class="text-xl hover:text-secondary">🇫🇷</button>
        <button @click="changeLang('en')" class="text-xl hover:text-secondary">🇬🇧</button>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, computed, watchEffect, onMounted, onUnmounted  } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter, useRoute } from 'vue-router'
import AuthButton from '@/components/AuthButton.vue'
import { fetchUserRole, role } from '@/composables/useAuth'
import { useCart } from '@/composables/useCart'

import Cart from '@/components/Cart.vue'

const showCart = ref(false)
const showNavbar = ref(false)
const isScrolled = ref(false)
const { items } = useCart()
const cartCount = computed(() => items.value.reduce((sum, i) => sum + i.quantity, 0))


function handleScroll() {
  const y = window.scrollY
  isScrolled.value = y > 100
  showNavbar.value = true
}

onMounted(() => {
  // Montre la navbar après 2s
  setTimeout(() => {
    showNavbar.value = true
  }, 800)

  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})



const isOpen = ref(false)
const langMenu = ref(false)
const { locale } = useI18n()

// Définition des liens avec le lien admin
const allLinks = [
  { path: '/', label: 'navbar.home' },
  { path: '/events', label: 'navbar.events' },
  { path: '/shop', label: 'navbar.shop' },
  { path: '/admin', label: 'navbar.admin' },
]

// Lien filtré selon les droits
const filteredLinks = computed(() =>
  allLinks.filter(link => link.path !== '/admin' || role.value === 'admin')
)

// Mise à jour du rôle (utilisé au login/logout)
function updateUserRole() {
  fetchUserRole()
}

function changeLang(lang: string) {
  locale.value = lang
  langMenu.value = false
}

// Re-fetch automatique au montage (et si besoin à chaque update réactive)
watchEffect(() => {
  fetchUserRole()
})

const router = useRouter()
const route = useRoute()

watchEffect(() => {
  if (route.path.startsWith('/admin') && role.value !== 'admin') {
    router.replace('/') // ou '/'
  }
})


</script>
