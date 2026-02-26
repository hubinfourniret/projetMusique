<script setup>
import {onMounted, ref} from 'vue'
import { useRouter } from 'vue-router'

const name = ref('')
const password = ref('')
const error = ref('')
const router = useRouter()

const ADMIN_PASSWORD = 'admin123'

function setCookie(key, value, days = 30) {
  const expires = new Date()
  expires.setDate(expires.getDate() + days)
  document.cookie = `${key}=${value};expires=${expires.toUTCString()};path=/`
}

function getCookie(key) {
  const match = document.cookie
      .split('; ')
      .find(row => row.startsWith(`${key}=`))
  return match ? match.split('=')[1] : null
}

// Au chargement de la page, on récupère le nom sauvegardé
onMounted(() => {
  const savedName = getCookie('username')
  if (savedName) {
    name.value = savedName
  }
})

function handleLogin() {
  error.value = ''

  if (!name.value.trim()) {
    error.value = 'Entrez votre nom.'
    return
  }

  if (name.value === 'root') {
    if (password.value !== ADMIN_PASSWORD) {
      error.value = 'Mot de passe incorrect.'
      return
    }
    router.push('/control')
  } else {
    setCookie('username', name.value, 30)
    router.push('/home')
  }
}
</script>

<template>
  <div class="wide w-screen min-h-screen bg-base-200 flex items-center justify-center">
    <div class="card w-96 bg-base-100 shadow-xl">
      <div class="card-body">

        <h2 class="card-title text-2xl justify-center mb-2">Musique</h2>
        <p class="text-center text-base-content/60 text-sm mb-4">
          Connecte-toi pour accéder à la playlist
        </p>

        <form @submit.prevent="handleLogin" class="flex flex-col gap-4">

          <div class="form-control">
            <label class="label">
              <span class="label-text">Nom</span>
            </label>
            <input
                v-model="name"
                type="text"
                placeholder="Entre ton nom"
                class="input input-bordered w-full"
            />
          </div>

          <div v-if="name === 'root'" class="form-control">
            <label class="label">
              <span class="label-text">Mot de passe</span>
            </label>
            <input
                v-model="password"
                type="password"
                placeholder="Mot de passe admin"
                class="input input-bordered w-full"
            />
          </div>

          <div v-if="error" role="alert" class="alert alert-error">
            <span>{{ error }}</span>
          </div>

          <button type="submit" class="btn btn-primary w-full mt-2">
            Se connecter
          </button>

        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>