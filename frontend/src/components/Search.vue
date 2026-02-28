<script setup lang="ts">
import { ref } from 'vue'
import { searchTracks } from '@/services/musicService'
import type { Song } from '@/types/song'
import { setCurrentSong } from '@/services/musicService'

const query = ref('')
const results = ref<Song[]>([])
const loading = ref(false)
let debounceTimer = null


function onSearch() {
  clearTimeout(debounceTimer)
  if (!query.value.trim()) {
    results.value = []
    return
  }
  debounceTimer = setTimeout(async () => {
    loading.value = true
    try {
      results.value = await searchTracks(query.value)
    } catch (e) {
      console.error(e)
    } finally {
      loading.value = false
    }
  }, 400)
}

//A Faire apres
function addToQueue(track) {
  console.log('Ajouter à la file :', track.title)
}
function addToNext(track) {
  console.log('Ajouter à la file :', track.title)
}
</script>

<template>
  <div class="flex flex-col gap-4">
    <label class="input input-bordered flex items-center gap-2 w-full">
      🔍
      <input
          v-model="query"
          type="text"
          placeholder="Rechercher une musique..."
          class="grow"
          @input="onSearch"
      />
      <span v-if="loading" class="loading loading-spinner loading-sm"></span>
    </label>

    <div class="flex flex-col gap-2">
      <div
          v-for="track in results"
          :key="track.id"
          class="flex items-center gap-3 bg-base-100 rounded-xl p-3 active:scale-95 transition cursor-pointer"
          @click="addToQueue(track);setCurrentSong(track)"

      >
        <img
            :src="track.cover"
            :alt="track.title"
            class="w-12 h-12 rounded-lg object-cover shrink-0"
        />

        <div class="flex-1 min-w-0">
          <p class="font-semibold text-sm truncate">{{ track.title }}</p>
          <p class="text-xs text-base-content/60 truncate">{{ track.artist }}</p>
        </div>
      </div>
    </div>

    <div v-if="!loading && results.length === 0 && query" class="text-center text-base-content/50 mt-8">
      Aucun résultat pour "{{ query }}"
    </div>

  </div>
</template>