<template>
  <div class="flex flex-col items-center justify-center min-h-screen bg-dark text-light px-6">
    <h1 class="text-6xl font-bold text-primary mb-4">404</h1>
    <h2 class="text-2xl font-heading mb-2">Page non trouvée</h2>
    <p class="text-light/70 mb-6 text-center max-w-md">
      Désolé, la page que vous recherchez n’existe pas ou a été déplacée.
    </p>
    <router-link
      to="/"
      class="px-6 py-2 rounded-xl bg-primary text-dark font-semibold shadow hover:bg-light hover:text-dark transition"
    >
      Retour à l’accueil
    </router-link>
  </div>
</template>

<script setup lang="ts">
// nothing special needed
</script>

<style scoped>
.bg-dark {
  background: #2b2729;
}
.text-light {
  color: #dee6ca;
}
.text-primary {
  color: #9ecdf1;
}
</style>
