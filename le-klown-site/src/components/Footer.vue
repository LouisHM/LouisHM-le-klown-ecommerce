<template>
  <footer class="bg-dark text-light py-10 px-6">
    <div class="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
      
      <!-- Réseaux sociaux -->
      <div class="space-y-4">
        <h3 class="text-xl font-heading text-primary">{{ $t('footer.followUs') }}</h3>
        <div class="flex justify-center gap-4 text-2xl">
          <a href="https://www.facebook.com/Klowntrance/" target="_blank" rel="noopener" class="hover:text-primary transition"><i class="fab fa-facebook"></i></a>
          <a href="https://www.instagram.com/klownlife" target="_blank" rel="noopener" class="hover:text-primary transition"><i class="fab fa-instagram"></i></a>
          <a href="https://tiktok.com/@leklown" target="_blank" rel="noopener" class="hover:text-primary transition"><i class="fab fa-tiktok"></i></a>
        </div>
      </div>

      <!-- Contact -->
      <div class="space-y-4 flex flex-col items-center justify-center">
        <button
          class="btn btn-red btn-lg"
          @click="$emit('contact-click')"
        >
          {{ $t('footer.contactMe') }}
        </button>
        <a href="https://www.leklown.com/privacy" target="_blank" rel="noopener" class="hover:text-primary transition text-xs"> {{ t('legal.privacy.title', { appName }) }} <i class="fa-solid fa-arrow-up-right-from-square"></i></a>
        <a href="https://www.leklown.com/useTerms" target="_blank" rel="noopener" class="hover:text-primary transition text-xs"> {{ t('legal.tos.title', { appName }) }} <i class="fa-solid fa-arrow-up-right-from-square"></i></a>

      </div>

      <!-- Booking -->
      <div class="space-y-4 flex flex-col items-center">
        <h3 class="text-xl font-heading text-primary">{{ $t('footer.listenMe') }}</h3>
        <div class="flex justify-center gap-4 text-2xl">
          <a href="https://open.spotify.com/intl-fr/artist/1Dk7GvynJJ9lOcTLQk6Ot3" target="_blank" rel="noopener" class="hover:text-primary transition"><i class="fab fa-spotify"></i></a>
          <a href="https://www.deezer.com/fr/artist/81617372" target="_blank" rel="noopener" class="hover:text-primary transition"><i class="fab fa-deezer"></i></a>
          <a href="https://music.apple.com/fr/artist/le-klown/1492515036" target="_blank" rel="noopener" class="hover:text-primary transition"><i class="fa-solid fa-music"></i></a>
          <a href="https://shotgun.live/en/artists/leklown" target="_blank" rel="noopener" class="hover:text-primary transition"><i class="fa-solid fa-hourglass"></i></a>
        </div>
      </div>
    </div>

    <!-- Bottom -->
    <div class="text-center text-xs text-gray-500 mt-10">
      © {{ new Date().getFullYear() }} LE KLOWN. {{ $t('footer.allRightsReserved') }}
    </div>
  </footer>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
defineEmits(['contact-click'])
const appName = 'LE KLOWN SHOP'
</script>
