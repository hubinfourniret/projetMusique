<script setup>
import {computed, ref} from 'vue'
import router from "@/router/index.js";
import {useQueueStore} from "@/stores/queueStore.js";




const isPlaying = ref(false)
//const volume = ref(70)
const progress = ref(35)
const currentTime = ref('1:12')
const duration = ref('3:24')
const queue = useQueueStore()

const currentSong = computed(() => queue.queue.at(-1) ?? null)

function togglePlay() { isPlaying.value = !isPlaying.value }
function next() { console.log('Suivant → Pi') }
function previous() { console.log('Précédent → Pi') }
console.log("une queue",queue.queue)

</script>

<template>

  <div class="sticky top-0 bg-base-200 z-10 mb-4 rounded-b-2xl px-4 pt-4 pb-3">
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
      <div v-if="currentSong" class="pt-6 pl-6 gap-2">
        <p class="font-semibold text-lg truncate">
          {{ currentSong.title }}
        </p>
        <p class="text-sm text-base-content/70 truncate">
          {{ currentSong.artist }}
        </p>
      </div>
    </div>
  </div>

    <div class=" min-h-screen flex flex-col bg-base-200">

      <div class="flex flex-col gap-2 pt-6 mb-4">
        <div
            v-for="song in queue.queue"
            :key="song.id"
            class="flex items-center gap-3 bg-base-100 rounded-xl p-3 mb-5"
        >
          <img
            :src="song.cover"
            :alt="song.title"
            class="w-12 h-12 rounded-lg object-cover shrink-0"
          />

          <div class="flex-1 min-w-0">
            <p class="font-semibold text-sm truncate">{{ song.title }}</p>
            <p class="text-xs text-base-content/60 truncate">{{ song.artist }}</p>

          </div>

          <div class="relative inline-block">
            <button class="btn btn-ghost btn-circle text-xl">
              ☰
            </button>
            <div/>

        </div>

      </div>


      <div class="sticky bottom-0 bg-base-200 z-10 mt-4 rounded-t-2xl px-4 pt-4 pb-3">
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


