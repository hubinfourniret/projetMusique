<script setup>
import { useQueueStore } from '@/stores/queueStore.js'

const store = useQueueStore()
</script>

<template>
  <div class="flex flex-col gap-2 w-full px-4">
    <div class="flex items-center gap-2 w-full">
      <span class="text-xs text-base-content/60 w-8 text-right tabular-nums">
        {{ store.elapsed }}
      </span>

      <progress
          class="progress progress-primary flex-1"
          :value="store.progress"
          max="100"
      />

      <span class="text-xs text-base-content/60 w-8 tabular-nums">
        {{ store.total }}
      </span>
    </div>
  </div>
</template>
