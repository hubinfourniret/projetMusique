<script setup>
import NavBar from '../components/NavBar.vue'
import PlayerBar from '../components/PlayerBar.vue'
import { getCookie } from '../utils/cookies.js'
import router from "@/router/index.js";
import { ref } from 'vue'

const username = getCookie('username')
if (!username) router.push('/login');


const currentSong = ref(null)

function setCurrentSong(track) {
  currentSong.value = track;
}

</script>

<template>
  <div class="flex flex-col h-screen w-full overflow-hidden bg-base-200">

    <NavBar :username="username" />

    <main class="flex-1 overflow-y-auto px-3 py-4">
      <RouterView :setCurrentSong="setCurrentSong" />
    </main>

    <PlayerBar :musique="currentSong" />

  </div>
</template>


