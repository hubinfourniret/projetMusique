<script setup>
import router from "@/router/index.js";
import { useQueueStore } from "@/stores/queueStore.js";
import { next, prev, toggle } from "@/services/musicService.js";
import QueueIcon from "@/components/Icons/QueueIcon.vue";
import PlayerProgress from "@/components/PlayerProgress.vue";

defineProps({
  full: {type: Boolean, default: false},
  list: {type: Boolean, default: false},
})

const store = useQueueStore()
</script>

<template>
  <div class="w-full bg-base-100 border-t border-base-300 px-3 py-2">

    <!-- Mode compact (full = true) -->
    <template v-if="!full">
      <div class="flex items-center justify-between gap-2">
        <div class="flex items-center gap-2 flex-1 min-w-0" @click="router.push('/focus')">
          <div v-if="store.currentTrack">
            <img
                :src="store.currentTrack.cover"
                :alt="store.currentTrack.title"
                class="w-12 h-12 rounded-lg object-cover shrink-0"
            />
          </div>
          <div class="min-w-0 flex flex-col gap-2">
            <p class="font-semibold text-sm truncate leading-tight">
              {{ store.currentTrack ? store.currentTrack.title : 'title' }}
            </p>
            <p class="text-xs text-base-content/60 truncate">
              {{ store.currentTrack ? store.currentTrack.artist : 'artist' }}
            </p>
          </div>
        </div>

        <div class="flex items-center gap-1 shrink-0">
          <button class="btn btn-ghost btn-sm btn-circle text-lg" @click="prev"><font-awesome-icon :icon="['fas', 'backward-step']"/></button>
          <button class="btn btn-primary btn-sm btn-circle text-lg" @click="toggle">
            <font-awesome-icon :icon="['fas', store.isPaused ? 'play': 'pause']"/>
          </button>
          <button class="btn btn-ghost btn-sm btn-circle text-lg" @click="next"><font-awesome-icon :icon="['fas', 'forward-step']" /></button>
        </div>
      </div>
    </template>

    <!-- Mode étendu (full = false) -->
    <template v-else>
      <!-- Barre de progression -->
      <PlayerProgress/>

      <!-- Boutons -->
      <div class="flex items-center justify-center gap-6 pb-6">
        <button class="btn btn-ghost btn-circle text-2xl" @click="prev"><font-awesome-icon :icon="['fas', 'backward-step']"/></button>
        <button class="btn btn-primary btn-circle btn-lg text-3xl" @click="toggle">
          <font-awesome-icon :icon="['fas', store.isPaused ? 'play': 'pause']"/>
        </button>
        <button class="btn btn-ghost btn-circle text-2xl" @click="next"><font-awesome-icon :icon="['fas', 'forward-step']" /></button>

        <!-- Bouton queue si list = true -->
        <div v-if="list" class="flex items-center gap-3 shrink-0 fab fab-flower">
          <button class="btn btn-ghost btn-circle btn-sm" @click="router.push('/ListView')">
            <QueueIcon/>
          </button>
        </div>
      </div>
    </template>

  </div>
</template>
