<script setup>
import NavBar from '../components/NavBar.vue'
import PlayerBar from '../components/PlayerBar.vue'
import { getCookie } from '../utils/cookies.js'
import router from "@/router/index.js";

const username = getCookie('username')
if (!username) router.push('/login');
</script>

<template>
  <div class="flex flex-col min-h-screen bg-base-200">

    <NavBar :username="username" />

    <main class="flex-1 overflow-y-auto pb-24 px-3 py-4">
      <RouterView />
    </main>

    <PlayerBar />

  </div>
</template>


