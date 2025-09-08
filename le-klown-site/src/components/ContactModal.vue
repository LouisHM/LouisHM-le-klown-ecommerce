<template>
  <Teleport to="body">
    <Transition name="fade">
      <div
        v-if="visible"
        class="fixed inset-0 z-[9999] px-6 flex items-center justify-center bg-black/70"
        role="dialog"
        aria-modal="true"
        :aria-label="topic || 'Contact modal'"
        @click="$emit('close')"
        @keydown.esc.prevent="$emit('close')"
      >
        <div
          class="bg-dark border border-gray-700 text-light p-6 rounded-xl shadow-lg w-full max-w-xl relative outline-none"
          tabindex="-1"
          @click.stop
          ref="panel"
        >
          <!-- Close button -->
          <button
            @click="$emit('close')"
            class="absolute top-3 right-3 text-light hover:text-red-500 text-2xl font-bold"
            :aria-label="$t?.('common.close') || 'Close'"
          >
            &times;
          </button>

          <!-- Your actual form -->
          <ContactForm />
          <!-- If later your ContactForm supports it, you can pass :topic="topic" -->
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import ContactForm from '@/components/ContactForm.vue'

// ✅ Declare 'topic' so passing topic="contact" doesn't warn
const props = defineProps<{ visible: boolean; topic?: string }>()
defineEmits(['close'])

const panel = ref<HTMLElement | null>(null)

// Focus the panel when the modal opens (keyboard/a11y)
watch(() => props.visible, (v) => {
  if (v) requestAnimationFrame(() => panel.value?.focus())
})
onMounted(() => {
  if (props.visible) panel.value?.focus()
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from,
.fade-leave-to { opacity: 0; }
</style>
