<template>
  <div class="pt-20 bg-dark text-light">

    <!-- Hero section full height -->
    <section class="min-h-screen flex flex-col items-center justify-center text-center px-6">
      <h1 class="text-6xl md:text-8xl font-heading text-primary mb-6">{{ $t('home.welcome') }}</h1>
      <p class="text-2xl md:text-3xl max-w-3xl">{{ $t('home.intro') }}</p>
    </section>

    <!-- Section 1 : image large + texte overlay -->
    <section class="relative group">
      <img src="/assets/img/leklown1.jpg" alt="LE KLOWN sur scène" class="w-full h-[70vh] object-cover grayscale group-hover:grayscale-0 transition duration-700" />
      <div class="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center text-center opacity-90 group-hover:opacity-0 transition duration-700">
        <h2 class="text-5xl md:text-6xl font-heading mb-4">{{ $t('home.section1Title') }}</h2>
        <p class="text-xl md:text-2xl max-w-2xl">{{ $t('home.section1Text') }}</p>
      </div>
    </section>

    <!-- Section 2 : image gauche + texte droite -->
    <section class="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12 py-20 px-6">
      <img src="/assets/img/leklown2.jpg" alt="Public du cirque" class="rounded-xl shadow-xl w-full md:w-1/2 object-cover" />
      <div class="flex-1">
        <h2 class="text-4xl md:text-5xl font-heading text-primary mb-6">{{ $t('home.section2Title') }}</h2>
        <p class="text-lg md:text-xl max-w-xl">{{ $t('home.section2Text') }}</p>
      </div>
    </section>

  </div>
</template>
