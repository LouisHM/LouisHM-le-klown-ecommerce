<template>
  <Teleport to="body">
    <!-- Backdrop -->
    <Transition
      enter-active-class="duration-200 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="duration-150 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="visible"
        class="fixed inset-0 z-[9999] flex items-center justify-center px-4 md:px-6"
        role="dialog"
        aria-modal="true"
        :aria-label="topic || t('common.contactModal') || 'Contact'"
        @click="$emit('close')"
      >
        <!-- Panel -->
        <Transition
          enter-active-class="duration-200 ease-out"
          enter-from-class="opacity-0 translate-y-2 scale-[0.98]"
          enter-to-class="opacity-100 translate-y-0 scale-100"
          leave-active-class="duration-150 ease-in"
          leave-from-class="opacity-100 translate-y-0 scale-100"
          leave-to-class="opacity-0 translate-y-2 scale-[0.98]"
        >
          <div
            v-if="visible"
            ref="panel"
            tabindex="-1"
            class="relative w-full max-w-xl rounded-2xl bg-backgroundDark text-light border border-light/10 shadow-2xl outline-none ring-1 ring-black/5"
            @click.stop
            @keydown.esc.stop.prevent="$emit('close')"
          >
            <!-- Glow decor (sous le contenu) -->
            <div class="pointer-events-none absolute inset-0 rounded-2xl border border-light/10 z-0"></div>
            <div class="pointer-events-none absolute -inset-px rounded-2xl bg-gradient-to-br from-primary/10 via-transparent to-transparent blur-xl z-0"></div>

            <!-- Close (au-dessus de tout) -->
            <button
              @click="$emit('close')"
              :aria-label="t('common.close') || 'Close'"
              class="absolute top-3 right-3 z-30 inline-flex items-center justify-center h-9 w-9 rounded-full bg-dark/60 border border-light/10 text-light hover:text-primary hover:bg-dark transition focus:outline-none focus:ring-2 focus:ring-primary/40"
            >
              <span aria-hidden="true" class="text-xl leading-none">&times;</span>
            </button>

            <!-- Content (z-10 au-dessus du décor) -->
            <div class="relative z-10">
              <ContactForm :topic="topic" @submitted="onSubmitted" />
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import ContactForm from '@/components/ContactForm.vue'

const { t } = useI18n()
const props = defineProps<{ visible: boolean; topic?: string }>()
const emit = defineEmits<{ (e: 'close'): void }>()

const panel = ref<HTMLElement | null>(null)

// Focus panel à l'ouverture
watch(() => props.visible, (v) => {
  if (v) requestAnimationFrame(() => panel.value?.focus())
  toggleScrollLock(v)
})
onMounted(() => {
  if (props.visible) {
    panel.value?.focus()
    toggleScrollLock(true)
  }
})
onUnmounted(() => {
  toggleScrollLock(false)
})

function toggleScrollLock(lock: boolean) {
  // Bloque le scroll du document quand la modale est ouverte
  const el = document.documentElement // plus robuste que body pour iOS
  if (lock) {
    el.classList.add('overflow-hidden')
  } else {
    el.classList.remove('overflow-hidden')
  }
}

function onSubmitted() {
  // Si tu veux fermer automatiquement après envoi :
  // emit('close')
}
</script>
