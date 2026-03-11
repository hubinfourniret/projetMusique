<script setup>
import {computed, ref} from 'vue'
import router from "@/router/index.js";
import {useQueueStore} from "@/stores/queueStore.js";
import QueueIcon from "@/components/Icons/QueueIcon.vue";
import PlayerProgress from "@/components/PlayerProgress.vue";

const isPlaying = ref(false)
const store = useQueueStore()
const currentSong = store.queue[0]

function togglePlay() { isPlaying.value = !isPlaying.value }
function next() { console.log('Suivant → Pi') }
function previous() { console.log('Précédent → Pi') }

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
            v-if="currentSong"
            :src="currentSong.cover"
            :alt="currentSong.title"
            class="w-56 h-56 md:w-64 md:h-64 rounded-xl object-cover shadow-lg"
        />
      </div>

      <!-- zone infos + barre + boutons = ~40% -->
      <div class="flex-2 flex flex-col justify-between px-6 pb-6">
        <!-- texte -->
        <div v-if="currentSong">
          <p class="font-semibold text-lg truncate">
            {{ currentSong.title }}
          </p>
          <p class="text-sm text-base-content/70 truncate">
            {{ currentSong.artist }}
          </p>
        </div>

        <!-- barre de progression -->
        <player-progress/>


        <!-- boutons -->
        <div class="flex items-center justify-center gap-6 pb-6">
          <button class="btn btn-ghost btn-circle text-2xl" @click="previous">⏮</button>
          <button class="btn btn-primary btn-circle btn-lg text-3xl" @click="togglePlay">
            {{ isPlaying ? '⏸' : '▶' }}
          </button>
          <button class="btn btn-ghost btn-circle text-2xl" @click="next">⏭</button>
          <div class="flex items-center gap-3 shrink-0 fab fab-flower">
            <button class="btn btn-ghost btn-circle btn-sm" @click="router.push('/ListView')"><QueueIcon/></button>
          </div>
        </div>
      </div>

    </div>

    </div>
</template>


