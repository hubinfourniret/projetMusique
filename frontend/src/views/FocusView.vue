<script setup>
import { ref } from 'vue'
import router from "@/router/index.js";
import { currentSong } from "@/services/musicService.js";


const isPlaying = ref(false)
const volume = ref(70)
const progress = ref(35)
const currentTime = ref('1:12')
const duration = ref('3:24')



function togglePlay() { isPlaying.value = !isPlaying.value }
function next() { console.log('Suivant → Pi') }
function previous() { console.log('Précédent → Pi') }


</script>

<template>
  <div class="w-full h-screen bg-base-100 border-t border-base-300">
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
        <div class="mt-4 mb-4">
          <div class="flex items-center gap-1 mb-1">
            <span class="text-xs text-base-content/60">{{ currentTime }}</span>
            <input
                type="range"
                min="0"
                max="100"
                v-model="progress"
                class="range range-primary h-1 flex-1"
            />
            <span class="text-xs text-base-content/60">{{ duration }}</span>
          </div>
        </div>

        <!-- boutons -->
        <div class="flex items-center justify-center gap-6 pb-6">
          <button class="btn btn-ghost btn-circle text-2xl" @click="previous">⏮</button>
          <button class="btn btn-primary btn-circle btn-lg text-3xl" @click="togglePlay">
            {{ isPlaying ? '⏸' : '▶' }}
          </button>
          <button class="btn btn-ghost btn-circle text-2xl" @click="next">⏭</button>
        </div>
      </div>

    </div>

    </div>
</template>


