<!-- src/pages/PolitiqueConfidentialite.vue -->
<template>
  <main class="min-h-screen bg-dark text-light">
    <section class="mx-auto w-full max-w-4xl px-4 sm:px-6 lg:px-8 pb-16 pt-24">
      <header class="mb-10">
        <h1 class="text-3xl sm:text-4xl font-heading text-primary uppercase">
          {{ t('legal.privacy.title', { appName }) }}
        </h1>
        <p class="mt-2 text-sm opacity-80">
          {{ t('legal.privacy.lastUpdated', { date: formattedDate }) }}
        </p>
      </header>

      <!-- Sommaire -->
      <nav aria-label="Sommaire" class="mb-10">
        <ul class="list-disc pl-6 space-y-1 text-sm">
          <li><a class="underline hover:no-underline" href="#identite">{{ t('legal.privacy.toc.identite') }}</a></li>
          <li><a class="underline hover:no-underline" href="#donnees-collectees">{{ t('legal.privacy.toc.donneesCollectees') }}</a></li>
          <li><a class="underline hover:no-underline" href="#finalites-bases">{{ t('legal.privacy.toc.finalitesBases') }}</a></li>
          <li><a class="underline hover:no-underline" href="#duree">{{ t('legal.privacy.toc.duree') }}</a></li>
          <li><a class="underline hover:no-underline" href="#destinataires">{{ t('legal.privacy.toc.destinataires') }}</a></li>
          <li><a class="underline hover:no-underline" href="#transferts">{{ t('legal.privacy.toc.transferts') }}</a></li>
          <li><a class="underline hover:no-underline" href="#securite">{{ t('legal.privacy.toc.securite') }}</a></li>
          <li><a class="underline hover:no-underline" href="#vos-droits">{{ t('legal.privacy.toc.vosDroits') }}</a></li>
          <li><a class="underline hover:no-underline" href="#cookies">{{ t('legal.privacy.toc.cookies') }}</a></li>
          <li><a class="underline hover:no-underline" href="#mineurs">{{ t('legal.privacy.toc.mineurs') }}</a></li>
          <li><a class="underline hover:no-underline" href="#modifs">{{ t('legal.privacy.toc.modifs') }}</a></li>
          <li><a class="underline hover:no-underline" href="#contact">{{ t('legal.privacy.toc.contact') }}</a></li>
        </ul>
      </nav>

      <article class="prose prose-invert max-w-none">
        <h2 id="identite">{{ t('legal.privacy.toc.identite') }}</h2>
        <p>{{ t('legal.privacy.sections.identite.p1', { appName }) }}</p>

        <h2 id="donnees-collectees">{{ t('legal.privacy.toc.donneesCollectees') }}</h2>
        <ul>
          <li>{{ t('legal.privacy.sections.donneesCollectees.l1') }}</li>
          <li>{{ t('legal.privacy.sections.donneesCollectees.l2') }}</li>
          <li>{{ t('legal.privacy.sections.donneesCollectees.l3') }}</li>
          <li>{{ t('legal.privacy.sections.donneesCollectees.l4') }}</li>
          <li>{{ t('legal.privacy.sections.donneesCollectees.l5') }}</li>
        </ul>
        <p class="text-xs opacity-80">{{ t('legal.privacy.sections.donneesCollectees.note') }}</p>

        <h2 id="finalites-bases">{{ t('legal.privacy.toc.finalitesBases') }}</h2>
        <ul>
          <li>{{ t('legal.privacy.sections.finalitesBases.l1') }}</li>
          <li>{{ t('legal.privacy.sections.finalitesBases.l2') }}</li>
          <li>{{ t('legal.privacy.sections.finalitesBases.l3') }}</li>
          <li>{{ t('legal.privacy.sections.finalitesBases.l4') }}</li>
        </ul>

        <h2 id="duree">{{ t('legal.privacy.toc.duree') }}</h2>
        <ul>
          <li>{{ t('legal.privacy.sections.duree.l1') }}</li>
          <li>{{ t('legal.privacy.sections.duree.l2') }}</li>
          <li>{{ t('legal.privacy.sections.duree.l3') }}</li>
          <li>{{ t('legal.privacy.sections.duree.l4') }}</li>
          <li>{{ t('legal.privacy.sections.duree.l5') }}</li>
        </ul>

        <h2 id="destinataires">{{ t('legal.privacy.toc.destinataires') }}</h2>
        <p>{{ t('legal.privacy.sections.destinataires.p1') }}</p>
        <ul>
          <li>{{ t('legal.privacy.sections.destinataires.l1') }}</li>
          <li>{{ t('legal.privacy.sections.destinataires.l2') }}</li>
          <li>{{ t('legal.privacy.sections.destinataires.l3') }}</li>
          <li>{{ t('legal.privacy.sections.destinataires.l4') }}</li>
        </ul>
        <p class="text-xs opacity-80">{{ t('legal.privacy.sections.destinataires.note') }}</p>

        <h2 id="transferts">{{ t('legal.privacy.toc.transferts') }}</h2>
        <p>{{ t('legal.privacy.sections.transferts.p1') }}</p>

        <h2 id="securite">{{ t('legal.privacy.toc.securite') }}</h2>
        <ul>
          <li>{{ t('legal.privacy.sections.securite.l1') }}</li>
          <li>{{ t('legal.privacy.sections.securite.l2') }}</li>
          <li>{{ t('legal.privacy.sections.securite.l3') }}</li>
        </ul>

        <h2 id="vos-droits">{{ t('legal.privacy.toc.vosDroits') }}</h2>
        <p>{{ t('legal.privacy.sections.vosDroits.p1') }}</p>
        <p class="text-xs opacity-80">{{ t('legal.privacy.sections.vosDroits.note') }}</p>

        <h2 id="cookies">{{ t('legal.privacy.toc.cookies') }}</h2>
        <ul>
          <li>{{ t('legal.privacy.sections.cookies.l1') }}</li>
          <li>{{ t('legal.privacy.sections.cookies.l2') }}</li>
          <li>{{ t('legal.privacy.sections.cookies.l3') }}</li>
        </ul>
        <p>{{ t('legal.privacy.sections.cookies.p1') }}</p>
        <p class="text-xs opacity-80">{{ t('legal.privacy.sections.cookies.p2') }}</p>

        <h2 id="mineurs">{{ t('legal.privacy.toc.mineurs') }}</h2>
        <p>{{ t('legal.privacy.sections.mineurs.p1') }}</p>

        <h2 id="modifs">{{ t('legal.privacy.toc.modifs') }}</h2>
        <p>{{ t('legal.privacy.sections.modifs.p1') }}</p>

        <h2 id="contact">{{ t('legal.privacy.toc.contact') }}</h2>
        <p>
          {{ t('legal.privacy.sections.contact.p1') }}<br />
          📩 <a class="underline hover:no-underline" :href="`mailto:${contactEmail}`">{{ contactEmail }}</a>
        </p>
      </article>
    </section>
  </main>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const appName = 'LE KLOWN SHOP'
const contactEmail = 'klownlifemusic@gmail.com'
const LAST_UPDATED = new Date('2025-09-24') // 24 septembre 2025

const { t, locale } = useI18n()

const formattedDate = computed(() => {
  const loc = (locale.value || 'fr').startsWith('fr') ? 'fr-FR' : 'en-GB'
  return new Intl.DateTimeFormat(loc, { day: '2-digit', month: 'long', year: 'numeric' }).format(LAST_UPDATED)
})
</script>

<style scoped>
.prose :where(h2) { @apply mt-10; }
</style>
