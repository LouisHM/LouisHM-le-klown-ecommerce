<template>
  <header class="fixed top-0 left-0 w-full bg-backgroundDark text-light shadow-md z-50">
    <nav class="max-w-7xl mx-auto flex justify-between items-center p-4">
      <div class="text-3xl font-heading tracking-wide">
        <img src="../assets/img/logo-klown.png" alt="LE KLOWN" width="50" class="inline-block mr-2">
        <span>LE KLOWN</span>
      </div>

      <!-- Menu desktop -->
      <div class="hidden md:flex items-center gap-4 text-lg">
        <RouterLink 
          class="px-4 py-2 rounded-full hover:bg-primary hover:text-dark transition"
          to="/">{{ $t('navbar.home') }}</RouterLink>
        <RouterLink 
          class="px-4 py-2 rounded-full hover:bg-gray-700 transition"
          to="/shop">{{ $t('navbar.shop') }}</RouterLink>
        <RouterLink 
          class="px-4 py-2 rounded-full hover:bg-light hover:text-dark transition"
          to="/admin">{{ $t('navbar.admin') }}</RouterLink>

        <!-- Language selector desktop -->
        <div class="relative ml-4">
          <button @click="langMenu = !langMenu" class="flex items-center px-4 py-2 rounded-full hover:bg-gray-700 transition focus:outline-none">
            <span v-if="$i18n.locale === 'fr'">🇫🇷</span>
            <span v-else>🇬🇧</span>
            <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
            </svg>
          </button>
          <div v-if="langMenu" class="absolute right-0 mt-2 w-fit bg-dark text-light rounded shadow-md z-50">
            <button @click="changeLang('fr')" class="block w-full text-center px-4 py-2 hover:bg-gray-700 rounded transition">🇫🇷 </button>
            <button @click="changeLang('en')" class="block w-full text-center px-4 py-2 hover:bg-gray-700 rounded transition">🇬🇧 </button>
          </div>
        </div>
      </div>

      <!-- Burger menu -->
      <button @click="isOpen = !isOpen" class="md:hidden text-3xl focus:outline-none">
        ☰
      </button>
    </nav>

    <!-- Menu mobile -->
    <div v-if="isOpen" class="flex flex-col items-center bg-primary md:hidden space-y-4 py-6">
      <RouterLink @click="isOpen = false" class="hover:text-secondary text-xl" to="/">{{ $t('navbar.home') }}</RouterLink>
      <RouterLink @click="isOpen = false" class="hover:text-secondary text-xl" to="/shop">{{ $t('navbar.shop') }}</RouterLink>
      <RouterLink @click="isOpen = false" class="hover:text-secondary text-xl" to="/admin">{{ $t('navbar.admin') }}</RouterLink>

      <!-- Lang selector mobile -->
      <div class="flex space-x-4 mt-4">
        <button @click="changeLang('fr')" class="text-2xl hover:text-secondary">🇫🇷</button>
        <button @click="changeLang('en')" class="text-2xl hover:text-secondary">🇬🇧</button>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

const isOpen = ref(false)
const langMenu = ref(false)

const { locale } = useI18n()

function changeLang(lang: string) {
  locale.value = lang
  langMenu.value = false
}
</script>
