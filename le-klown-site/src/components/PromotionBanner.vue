<template>
  <div v-if="messages.length" class="relative w-full overflow-hidden bg-primary py-1">
    <div
      class="flex whitespace-nowrap animate-marquee text-light text-xs md:text-sm font-light tracking-wide"
    >
      <span
        v-for="(msg, idx) in repeatedMessages"
        :key="idx"
        class="mx-6"
      >
        {{ t(msg) }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const props = defineProps<{ promos?: string[] }>()

// fallback message
const messages = computed(() =>
  props.promos?.length ? props.promos : ['shop.promo.default']
)

// repeat messages enough times to fill + animate
const repeatedMessages = computed(() => {
  return Array(10).fill(messages.value).flat()
})
</script>

<style scoped>
@keyframes marquee {
  0% {
    transform: translateX(0%);
  }
  100% {
    transform: translateX(-50%);
  }
}

.animate-marquee {
  display: inline-flex;
  min-width: 200%;
  animation: marquee 20s linear infinite;
}
</style>
