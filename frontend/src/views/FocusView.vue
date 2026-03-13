<script setup>
import router from "@/router/index.js";
import {useQueueStore} from "@/stores/queueStore.js";
import PlayerBar from "@/components/PlayerBar.vue";

const store = useQueueStore()

</script>

<template>
  <div class="w-full overflow-hidden h-screen bg-base-100 border-t border-base-300">
    <div class="min-h-screen flex flex-col bg-base-200">
      <div class="h-10 flex items-center ">
        <button class="btn btn-ghost btn-circle text-2xl" @click="router.push('/home')"><</button>
      </div>
      <!-- zone pochette = ~60% de la hauteur -->
      <div class="flex-3 flex items-center justify-center">
        <img
            v-if="store.currentTrack"
            :src="store.currentTrack.cover"
            :alt="store.currentTrack.title"
            class="w-56 h-56 md:w-64 md:h-64 rounded-xl object-cover shadow-lg"
        />
      </div>

      <!-- zone infos + barre + boutons = ~40% -->
      <div class="flex-2 flex flex-col justify-between px-6 pb-6">
        <!-- texte -->
        <div v-if="store.currentTrack">
          <p class="font-semibold text-lg truncate">
            {{ store.currentTrack.title }}
          </p>
          <p class="text-sm text-base-content/70 truncate">
            {{ store.currentTrack.artist }}
          </p>
        </div>
      </div>

      <PlayerBar :full=true :list=true />
    </div>
  </div>
</template>


