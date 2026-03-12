<script setup>
import {computed, ref} from 'vue'
import router from "@/router/index.js";
import {useQueueStore} from "@/stores/queueStore.js";
import PlayerProgress from "@/components/PlayerProgress.vue";

const store = useQueueStore()
const isPlaying = ref(false)
const currentSong = store.queue[0]

function togglePlay() { isPlaying.value = !isPlaying.value }
function next() { console.log('Suivant → Pi') }
function previous() { console.log('Précédent → Pi') }

</script>

<template>
  <div class="h-screen overflow-hidden flex flex-col bg-base-200">
    <div class="sticky  top-0 bg-base-200 z-10 mb-4 rounded-b-2xl px-4 pt-4 pb-3">
      <div class=" h-10 flex items-center ">
        <button class="btn btn-ghost btn-circle text-2xl" @click="router.push('/focus')"><</button>
      </div>
      <div class="flex-1 flex">
        <img
            v-if="currentSong"
            :src="currentSong.cover"
            :alt="currentSong.title"
            class="w-36 h-36 md:w-34 md:h-34 rounded-xl object-cover shadow-lg pt-6 pl-6 gap-2 "
        />
        <div v-if="currentSong" class="pt-6 pl-6 gap-2 min-w-0">
          <p class="font-semibold text-lg truncate">
            {{ currentSong.title }}
          </p>
          <p class="text-sm text-base-content/70 truncate">
            {{ currentSong.artist }}
          </p>
        </div>
      </div>
    </div>

    <div class="flex-1 w-full overflow-y-auto px-4">
      <div class="flex w-full flex-col gap-2 pt-6 mb-4 p-4%">
        <div
            v-for="song in store.queue"
            :key="song.id"
            class="flex items-center gap-3 bg-base-100 rounded-xl p-3 mb-5"
        >
          <img
            :src="song.cover"
            :alt="song.title"
            class="w-12 h-12 rounded-lg object-cover shrink-0"
          />

          <div class="flex-1 min-w-0">
            <p class="font-semibold text-lg truncate">{{ song.title }}</p>
            <p class="text-sm text-base-content/60 truncate">{{ song.artist }}</p>

          </div>

          <div class="relative inline-block">
            <button class="btn btn-ghost btn-circle text-xl">
              ☰
            </button>
            <div/>
        </div>
      </div>
      </div>
    </div>

    <div class="bg-base-200 z-10 mt-4 rounded-t-2xl px-4 pt-4 pb-3">
      <player-progress/>

      <div class="flex items-center justify-center gap-6 pb-6">
        <button class="btn btn-ghost btn-circle text-2xl" @click="previous">⏮</button>
        <button class="btn btn-primary btn-circle btn-lg text-3xl" @click="togglePlay">
          {{ isPlaying ? '⏸' : '▶' }}
        </button>
        <button class="btn btn-ghost btn-circle text-2xl" @click="next">⏭</button>
      </div>
    </div>

  </div>

</template>


