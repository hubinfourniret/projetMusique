<script setup>
import { onMounted } from 'vue'
import { useQueueStore } from './stores/queueStore.js'

const store = useQueueStore()
onMounted(() => store.connect())
</script>
<template>
  <RouterView />
</template>
