<template>
  <img
    v-bind="$attrs"
    :src="resolvedSrc || undefined"
    :alt="altText"
    @error="handleError"
  />
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { getCachedImageUrl } from '@/utils/imageCache'

defineOptions({ inheritAttrs: false })

const props = defineProps<{
  src?: string | null
  alt?: string
  placeholder?: string | null
}>()

const resolvedSrc = ref<string | null>(props.placeholder ?? null)
const currentRequest = ref(0)

const altText = computed(() => props.alt ?? '')

async function resolveSource(value?: string | null, token = 0) {
  const placeholder = props.placeholder ?? null
  if (!value) {
    resolvedSrc.value = placeholder
    return
  }
  try {
    const cached = await getCachedImageUrl(value)
    if (token !== currentRequest.value) return
    resolvedSrc.value = cached ?? placeholder ?? null
  } catch {
    if (token !== currentRequest.value) return
    resolvedSrc.value = placeholder
  }
}

watch(
  () => props.src,
  (value) => {
    const token = ++currentRequest.value
    void resolveSource(value, token)
  },
  { immediate: true },
)

function handleError() {
  if (props.placeholder) {
    resolvedSrc.value = props.placeholder
  }
}
</script>
