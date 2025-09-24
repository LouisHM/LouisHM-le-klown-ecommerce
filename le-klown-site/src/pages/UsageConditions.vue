<template>
  <main class="min-h-screen bg-dark text-light">
    <section class="mx-auto w-full max-w-4xl px-4 sm:px-6 lg:px-8 pb-16 pt-24">
      <header class="mb-10">
        <h1 class="text-3xl sm:text-4xl font-heading text-primary uppercase">
          {{ t('legal.tos.title', { appName }) }}
        </h1>
        <p class="mt-2 text-sm opacity-80">
          {{ t('legal.tos.lastUpdated', { date: formattedDate }) }}
        </p>
      </header>

      <!-- Sommaire -->
      <nav aria-label="Sommaire" class="mb-10">
        <ul class="list-disc pl-6 space-y-1 text-sm">
          <li><a class="underline hover:no-underline" href="#acceptation">{{ t('legal.tos.toc.acceptation') }}</a></li>
          <li><a class="underline hover:no-underline" href="#eligibilite">{{ t('legal.tos.toc.eligibilite') }}</a></li>
          <li><a class="underline hover:no-underline" href="#compte">{{ t('legal.tos.toc.compte') }}</a></li>
          <li><a class="underline hover:no-underline" href="#evenements">{{ t('legal.tos.toc.evenements') }}</a></li>
          <li><a class="underline hover:no-underline" href="#boutique">{{ t('legal.tos.toc.boutique') }}</a></li>
          <li><a class="underline hover:no-underline" href="#promotions">{{ t('legal.tos.toc.promotions') }}</a></li>
          <li><a class="underline hover:no-underline" href="#contact-form">{{ t('legal.tos.toc.contactForm') }}</a></li>
          <li><a class="underline hover:no-underline" href="#propriete">{{ t('legal.tos.toc.propriete') }}</a></li>
          <li><a class="underline hover:no-underline" href="#retractation">{{ t('legal.tos.toc.retractation') }}</a></li>
          <li><a class="underline hover:no-underline" href="#garanties">{{ t('legal.tos.toc.garanties') }}</a></li>
          <li><a class="underline hover:no-underline" href="#prix">{{ t('legal.tos.toc.prix') }}</a></li>
          <li><a class="underline hover:no-underline" href="#donnees">{{ t('legal.tos.toc.donnees') }}</a></li>
          <li><a class="underline hover:no-underline" href="#responsabilite">{{ t('legal.tos.toc.responsabilite') }}</a></li>
          <li><a class="underline hover:no-underline" href="#resiliation">{{ t('legal.tos.toc.resiliation') }}</a></li>
          <li><a class="underline hover:no-underline" href="#modifs">{{ t('legal.tos.toc.modifs') }}</a></li>
          <li><a class="underline hover:no-underline" href="#droit-applicable">{{ t('legal.tos.toc.droitApplicable') }}</a></li>
          <li><a class="underline hover:no-underline" href="#contact">{{ t('legal.tos.toc.contact') }}</a></li>
        </ul>
      </nav>

      <article class="prose prose-invert max-w-none">
        <h2 id="acceptation">{{ t('legal.tos.toc.acceptation') }}</h2>
        <p>{{ t('legal.tos.sections.acceptation.p1', { appName }) }}</p>

        <h2 id="eligibilite">{{ t('legal.tos.toc.eligibilite') }}</h2>
        <ul>
          <li>{{ t('legal.tos.sections.eligibilite.l1') }}</li>
          <li>{{ t('legal.tos.sections.eligibilite.l2') }}</li>
        </ul>

        <h2 id="compte">{{ t('legal.tos.toc.compte') }}</h2>
        <ul>
          <li>{{ t('legal.tos.sections.compte.l1') }}</li>
          <li>{{ t('legal.tos.sections.compte.l2') }}</li>
          <li>{{ t('legal.tos.sections.compte.l3') }}</li>
        </ul>

        <h2 id="evenements">{{ t('legal.tos.toc.evenements') }}</h2>
        <ul>
          <li>{{ t('legal.tos.sections.evenements.l1') }}</li>
          <li>{{ t('legal.tos.sections.evenements.l2') }}</li>
          <li>{{ t('legal.tos.sections.evenements.l3') }}</li>
        </ul>

        <h2 id="boutique">{{ t('legal.tos.toc.boutique') }}</h2>
        <ul>
          <li>{{ t('legal.tos.sections.boutique.l1') }}</li>
          <li>{{ t('legal.tos.sections.boutique.l2') }}</li>
          <li>{{ t('legal.tos.sections.boutique.l3') }}</li>
          <li>{{ t('legal.tos.sections.boutique.l4') }}</li>
          <li>{{ t('legal.tos.sections.boutique.l5') }}</li>
        </ul>

        <h2 id="promotions">{{ t('legal.tos.toc.promotions') }}</h2>
        <ul>
          <li>{{ t('legal.tos.sections.promotions.l1') }}</li>
          <li>{{ t('legal.tos.sections.promotions.l2') }}</li>
        </ul>

        <h2 id="contact-form">{{ t('legal.tos.toc.contactForm') }}</h2>
        <ul>
          <li>{{ t('legal.tos.sections.contactForm.l1') }}</li>
          <li>{{ t('legal.tos.sections.contactForm.l2') }}</li>
          <li>{{ t('legal.tos.sections.contactForm.l3') }}</li>
        </ul>

        <h2 id="propriete">{{ t('legal.tos.toc.propriete') }}</h2>
        <ul>
          <li>{{ t('legal.tos.sections.propriete.l1') }}</li>
          <li>{{ t('legal.tos.sections.propriete.l2') }}</li>
          <li>{{ t('legal.tos.sections.propriete.l3') }}</li>
        </ul>

        <h2 id="retractation">{{ t('legal.tos.toc.retractation') }}</h2>
        <p>{{ t('legal.tos.sections.retractation.p1') }}</p>
        <p>{{ t('legal.tos.sections.retractation.p2') }}</p>

        <h2 id="garanties">{{ t('legal.tos.toc.garanties') }}</h2>
        <ul>
          <li>{{ t('legal.tos.sections.garanties.l1') }}</li>
          <li>{{ t('legal.tos.sections.garanties.l2') }}</li>
          <li>{{ t('legal.tos.sections.garanties.l3') }}</li>
        </ul>

        <h2 id="prix">{{ t('legal.tos.toc.prix') }}</h2>
        <ul>
          <li>{{ t('legal.tos.sections.prix.l1') }}</li>
          <li>{{ t('legal.tos.sections.prix.l2') }}</li>
          <li>{{ t('legal.tos.sections.prix.l3') }}</li>
        </ul>

        <h2 id="donnees">{{ t('legal.tos.toc.donnees') }}</h2>
        <p>{{ t('legal.tos.sections.donnees.p1') }}
          <a :href="`mailto:${contactEmail}`" class="underline hover:no-underline">{{ contactEmail }}</a>.
        </p>

        <h2 id="responsabilite">{{ t('legal.tos.toc.responsabilite') }}</h2>
        <ul>
          <li>{{ t('legal.tos.sections.responsabilite.l1') }}</li>
          <li>{{ t('legal.tos.sections.responsabilite.l2') }}</li>
        </ul>

        <h2 id="resiliation">{{ t('legal.tos.toc.resiliation') }}</h2>
        <ul>
          <li>{{ t('legal.tos.sections.resiliation.l1') }}</li>
          <li>{{ t('legal.tos.sections.resiliation.l2') }}</li>
        </ul>

        <h2 id="modifs">{{ t('legal.tos.toc.modifs') }}</h2>
        <p>{{ t('legal.tos.sections.modifs.p1') }}</p>

        <h2 id="droit-applicable">{{ t('legal.tos.toc.droitApplicable') }}</h2>
        <p>{{ t('legal.tos.sections.droitApplicable.p1') }}</p>
        <p class="text-xs opacity-80">{{ t('legal.tos.sections.droitApplicable.p2') }}</p>

        <h2 id="contact">{{ t('legal.tos.toc.contact') }}</h2>
        <p>
          {{ t('legal.tos.sections.contact.p1') }}<br />
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
