<script setup>
import { onMounted } from 'vue'
import { useSpotifyPlayer } from '@/composables/useSpotifyPlayer.js'

const { init } = useSpotifyPlayer()

onMounted(() => init())
</script>

<template>
  <div class="flex items-center justify-center h-screen bg-base-200">
    <p class="text-base-content/40 text-sm">Raspberry Player actif</p>
  </div>
</template>
