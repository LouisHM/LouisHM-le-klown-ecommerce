<template>
  <Teleport to="body">
    <Transition name="fade">
      <div
        v-if="visible"
        class="fixed inset-0 z-[9999] px-6 flex items-center justify-center bg-black/70"
        @click="$emit('close')"
      >
        <div
          class="bg-dark border border-gray-700 text-light p-6 rounded-xl shadow-lg w-full max-w-xl relative"
          @click.stop
        >
          <!-- Close button -->
          <button
            @click="$emit('close')"
            class="absolute top-3 right-3 text-light hover:text-red-500 text-2xl font-bold"
          >
            &times;
          </button>

          <ContactForm />
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
defineProps<{ visible: boolean }>()
defineEmits(['close'])
import ContactForm from './ContactForm.vue'
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
