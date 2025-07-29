<template>
  <footer class="bg-dark text-light py-10 px-6">
    <div class="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-center">
      
      <!-- Réseaux sociaux -->
      <div class="space-y-4">
        <h3 class="text-xl font-heading text-primary flex flex-col items-center md:items-center">{{ $t('footer.followUs') }}</h3>
        <div class="flex justify-center md:justify-center gap-4 text-2xl">
          <a href="https://facebook.com/leklown" target="_blank" rel="noopener" class="hover:text-primary transition"><i class="fab fa-facebook"></i></a>
          <a href="https://instagram.com/leklown" target="_blank" rel="noopener" class="hover:text-primary transition"><i class="fab fa-instagram"></i></a>
          <a href="https://tiktok.com/@leklown" target="_blank" rel="noopener" class="hover:text-primary transition"><i class="fab fa-tiktok"></i></a>
        </div>
      </div>

      <!-- Contact -->
      <div class="space-y-4">
        <h3 class="text-xl font-heading text-primary flex flex-col items-center md:items-center">{{ $t('footer.contact') }}</h3>
        <p class="text-sm">📞 +33 6 12 34 56 78</p>
        <p class="text-sm">📧 <a href="mailto:contact@leklown.fr" class="hover:text-primary transition">contact@leklown.fr</a></p>
      </div>

      <!-- Booking -->
      <div class="space-y-4 flex flex-col items-center md:items-center">
        <h3 class="text-xl font-heading text-primary">{{ $t('footer.reservation') }}</h3>
        <button
        class="bg-primary text-light px-6 py-3 rounded-full font-semibold hover:bg-light hover:text-dark transition-all duration-700"
        @click="openBooking"
        >
        {{ $t('home.bookMe') }}
        </button>
      </div>
    </div>

    <!-- Bottom -->
    <div class="text-center text-xs text-gray-500 mt-10">
      © {{ new Date().getFullYear() }} LE KLOWN. {{ $t('footer.allRightsReserved') }}
    </div>
  </footer>
</template>

<script setup>
// Aucune logique JS nécessaire ici
</script>
