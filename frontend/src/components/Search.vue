<script setup>
import { ref } from 'vue'
import {add, addNext, searchTracks} from '@/services/musicService'
import IconsList from "@/components/Icons/IconsList.vue";

const query = ref('')
const results = ref([])
const loading = ref(false)
let debounceTimer = null
const isOpen = ref(null)
const openMenuId = ref(null)
let check = ref(false)

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

function toggleMenuId (trakId){
  if(openMenuId.value === trakId){
    openMenuId.value = null;
    isOpen.value = null;
  }
  else{
    openMenuId.value = trakId;
    isOpen.value = trakId;
  }

}
function checkAdd(){
  check.value = true;
  setTimeout(()=>{check.value = false},5000)
}

//A Faire apres
async function addToQueue(id) {
  try {
    await add(id)
  } catch (e) {
    console.error(e)
  }
}

async function addToNext(id) {
  try {
    await addNext(id)
  } catch (e) {
    console.error(e)
  }
}
</script>

<template>
  <div class="flex flex-col gap-4" @click="isOpen = null">
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
          class="flex items-center gap-3 bg-base-100 rounded-xl p-3 "
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
        <div class="relative inline-block">
          <button class="btn btn-ghost btn-circle text-xl" @click.stop="toggleMenuId(track.id)">
            ☰
          </button>

          <div v-if="openMenuId === track.id && isOpen === track.id"
               class="absolute right-full mr-2 top-1/2 -translate-y-1/2 flex flex-col gap-2"
          >
            <button class="btn btn-ghost btn-circle btn-sm" @click.stop="addNext(track.id); isOpen = null;openMenuId = null;checkAdd()">
              <IconsList :debutList="true"/>
            </button>

            <button class="btn btn-ghost btn-circle btn-sm"  @click.stop="add(track.id); isOpen = null;openMenuId = null;checkAdd()">
              <IconsList />
            </button>

          </div>
        </div>


      </div>
    </div>
    <div v-if="check === true" class="fab fab-flower translate-y-[-75px] translate-x-[-10px]">
      <div class="px-4 py-1 rounded-xl bg-base-200 text-sm shadow-lg">
        music added to list !
      </div>
    </div>

    <div v-if="!loading && results.length === 0 && query" class="text-center text-base-content/50 mt-8">
      Aucun résultat pour "{{ query }}"
    </div>

  </div>
</template>