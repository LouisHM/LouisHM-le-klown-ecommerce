<template>
  <div class="bg-dark text-light">

      <!-- Hero section full height -->
    <section
      class=" pt-24 relative min-h-screen flex flex-col justify-center gap-5 w-full overflow-hidden text-light bg-black"
      :style="hasHeroVideo ? undefined : fallbackBackground"
    >
      <!-- Vidéo background -->
      <video
        v-if="hasHeroVideo"
        autoplay muted loop playsinline
        class="absolute inset-0 w-full h-full object-cover brightness-[0.4]"
      >
        <source :src="heroVideoSrc" type="video/mp4" />
        {{ $t('home.errorVideo') }}

      </video>

      <!-- Overlay + texte + boutons -->
      <div class="relative  z-10 flex flex-col justify-center items-center h-full gap-5 text-center px-6">

        <!-- Titre -->
        <h1
          :class="showHero ? 'animate-slide-in-left' : 'opacity-0 -translate-x-full'"
          class="text-5xl md:text-7xl font-heading mb-6 tracking-tight transition-all duration-700"
        >
          {{ $t('home.welcome') }}
        </h1>

        <!-- Sous-titre -->
        <p
          :class="showHero ? 'animate-slide-in-right  w-full' : 'opacity-0 translate-x-full'"
          class="text-xl max-w-5xl mb-10 transition-all duration-700 text-xs md:text-xl"
        >
          {{ $t('home.intro') }}
        </p>

        <!-- Boutons -->
        <div class="flex flex-col md:flex-col gap-3 mb-16 ">
          <button
            :class="showHero ? 'animate-slide-in-right opacity-85' : 'opacity-0 translate-x-full'"
            class="bg-primary  text-light px-6 py-3 rounded-full font-semibold hover:bg-light hover:text-dark transition-all duration-700"
            @click="showContact = true"
          >
            {{ $t('home.bookMe') }}
          </button>
        <div>
          <ContactModal :visible="showContact" @close="showContact = false" />
        </div>

          <RouterLink
            to="/events"
            :class="showHero ? 'animate-slide-in-left opacity-85' : 'opacity-0 -translate-x-full'"
            class="hover:bg-light  hover:text-dark px-6 py-3 rounded-full font-semibold bg-dark text-light hover:text-dark transition-all duration-700"
          >
            {{ $t('home.seeLive') }}
          </RouterLink>
        </div>

        <!-- ↓ Flèche vers section suivante -->
        <button
          v-show="showHero "
          @click="scrollToNextSection"
          class="opacity-0 animate-fade-in text-xl text-dark bg-light text-primary rounded-full p-2 aspect-square hover:text-light hover:bg-dark transition"
        >
        <i class="fa-solid fa-arrow-down"></i>
        </button>
      </div>

    </section>

    <!-- Section 1 : image large + texte overlay -->
    <section class="relative group" id="section-1">
      <img src="/assets/img/leklown1.jpg" alt="LE KLOWN sur scène" class="w-full h-[70vh] object-cover grayscale group-hover:grayscale-0 transition duration-700" />
      <div class="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center text-center opacity-90 group-hover:opacity-0 transition duration-700">
        <h2 class="text-5xl md:text-6xl font-heading mb-4">{{ $t('home.section1Title') }}</h2>
        <p class="text-xl md:text-2xl max-w-2xl">{{ $t('home.section1Text') }}</p>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import ContactModal from '@/components/ContactModal.vue'

const heroVideoEnv = (import.meta as any).env?.VITE_HERO_VIDEO_URL
const resolvedHeroVideo = typeof heroVideoEnv === 'string' ? heroVideoEnv.trim() : ''
const heroVideoSrc = resolvedHeroVideo === 'disabled'
  ? ''
  : (resolvedHeroVideo || '/assets/videos/show1.mp4')
const hasHeroVideo = heroVideoSrc.trim().length > 0

const fallbackBackground: Record<string, string> = {
  backgroundImage: "url('/assets/img/leklown1.jpg')",
  backgroundSize: 'cover',
  backgroundPosition: 'center',
}

const showContact = ref(false)


const showHero = ref(false)
const showScroll = ref(false)

onMounted(() => {
  setTimeout(() => showHero.value = true, 2000)
  setTimeout(() => showScroll.value = true, 3000)
})


function scrollToNextSection() {
  const next = document.getElementById('section-1')
  if (next) next.scrollIntoView({ behavior: 'smooth' })
}


</script>

<style scoped>
@keyframes slide-in-right {
  from {
    opacity: 0;
    transform: translateX(80vw);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}
@keyframes slide-in-left {
  from {
    opacity: 0;
    transform: translateX(-80vw);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}
@keyframes fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.animate-slide-in-right {
  animation: slide-in-right 0.5s ease-out forwards;
}

.animate-slide-in-left {
  animation: slide-in-left 0.5s ease-out forwards;
}

.animate-fade-in {
  animation: fade-in 0.5s ease-out forwards;
}
</style>
