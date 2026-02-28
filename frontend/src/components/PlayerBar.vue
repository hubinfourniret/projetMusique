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
  <div class="w-full bg-base-100 border-t border-base-300">
    <div class="px-3 py-2">

      <div class="flex items-center justify-between gap-2 ">

        <div class="flex items-center gap-2 flex-1 min-w-0" @click="router.push('/focus')">
          <div v-if="currentSong">
            <img
                :src="currentSong ? currentSong.cover : null"
                :alt="currentSong ? currentSong.title : null"
                class="w-12 h-12 rounded-lg object-cover shrink-0"
            />
          </div>
          <div class="min-w-0 flex flex-col gap-2">

            <p class="font-semibold text-sm truncate leading-tight">
              {{ currentSong ? currentSong.title : 'title' }}
            </p>
            <p class="text-xs text-base-content/60 truncate">
              {{ currentSong ? currentSong.artist : 'artist' }}
            </p>
          </div>
        </div>

        <div class="flex items-center gap-1 shrink-0">
          <button class="btn btn-ghost btn-sm btn-circle text-lg" @click="previous">
            ⏮
          </button>
          <button class="btn btn-primary btn-sm btn-circle text-lg" @click="togglePlay">
            {{ isPlaying ? '⏸' : '▶' }}
          </button>
          <button class="btn btn-ghost btn-sm btn-circle text-lg" @click="next">
            ⏭
          </button>
        </div>

      </div>

      <div class="hidden md:flex items-center gap-2 mt-2 px-1">
        <span class="text-sm">🔇</span>
        <input
            v-model="volume"
            type="range" min="0" max="100"
            class="range range-primary range-xs h-1 flex-1"
        />
        <span class="text-sm">🔊</span>
      </div>

      <div class="flex items-center gap-2 mt-1 md:hidden">
        <span class="text-xs text-base-content/50">{{ currentTime }}</span>
        <progress
            class="progress progress-primary flex-1 h-1"
            :value="progress"
            max="100"
        ></progress>
        <span class="text-xs text-base-content/50">{{ duration }}</span>
      </div>

    </div>
  </div>
</template>


