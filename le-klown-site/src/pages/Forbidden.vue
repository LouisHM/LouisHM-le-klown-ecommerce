<template>
  <div class="pt-24 min-h-screen bg-dark text-light flex flex-col items-center justify-start gap-6 px-6 text-center">
    <h1 class="text-5xl md:text-6xl font-heading">403</h1>
    <p class="text-lg md:text-xl max-w-xl text-light/80">
      {{ $t('common.forbiddenMessage') || 'Tu n’as pas les droits pour accéder à cette page.' }}
    </p>
    <router-link
      to="/"
      class="btn btn-white"
    >
      {{ $t('common.backHome') || 'Retour à l’accueil' }}
    </router-link>
  </div>
</template>

<script setup lang="ts">
</script>
