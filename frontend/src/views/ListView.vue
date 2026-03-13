<script setup>
import router from "@/router/index.js";
import {useQueueStore} from "@/stores/queueStore.js";
import PlayerBar from "@/components/PlayerBar.vue";

const store = useQueueStore()

</script>

<template>
  <div class="h-screen overflow-hidden flex flex-col bg-base-200">
    <div class="sticky  top-0 bg-base-200 z-10 mb-4 rounded-b-2xl px-4 pt-4 pb-3">
      <div class=" h-10 flex items-center ">
        <button class="btn btn-ghost btn-circle text-2xl" @click="router.push('/focus')"><</button>
      </div>
      <div class="flex-1 flex">
        <img
            v-if="store.currentTrack"
            :src="store.currentTrack.cover"
            :alt="store.currentTrack.title"
            class="w-36 h-36 md:w-34 md:h-34 rounded-xl object-cover shadow-lg pt-6 pl-6 gap-2 "
        />
        <div v-if="store.currentTrack" class="pt-6 pl-6 gap-2 min-w-0">
          <p class="font-semibold text-lg truncate">
            {{ store.currentTrack.title }}
          </p>
          <p class="text-sm text-base-content/70 truncate">
            {{ store.currentTrack.artist }}
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

    <PlayerBar :full=true />
  </div>
</template>


