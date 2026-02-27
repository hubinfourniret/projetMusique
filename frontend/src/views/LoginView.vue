<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { setCookie, getCookie } from '../utils/cookies.js'

const name = ref('')
const password = ref('')
const error = ref('')
const router = useRouter()

const ADMIN_PASSWORD = 'admin123'

onMounted(() => {
  const savedName = getCookie('username')
  if (savedName) name.value = savedName
})

function handleLogin() {
  error.value = ''

  if (!name.value.trim()) {
    error.value = 'Entrez votre nom.'
    return
  }

  setCookie('username', name.value, 30)

  if (name.value === 'root') {
    if (password.value !== ADMIN_PASSWORD) {
      error.value = 'Mot de passe incorrect.'
      return
    }
    router.push('/control')
  } else {
    router.push('/home')
  }
}
</script>

<template>
  <div class="w-screen min-h-screen bg-base-200 flex items-center justify-center px-4">
    <div class="card w-full max-w-sm bg-base-100 shadow-xl">
      <div class="card-body px-6 py-8">

        <h2 class="card-title text-2xl justify-center mb-1">Musique</h2>
        <p class="text-center text-base-content/60 text-sm mb-4">
          Connecte-toi pour accéder à la playlist
        </p>

        <form @submit.prevent="handleLogin" class="flex flex-col gap-4">

          <div class="form-control">
            <label class="label py-1">
              <span class="label-text">Nom</span>
            </label>
            <input
                v-model="name"
                type="text"
                placeholder="Entre ton nom"
                class="input input-bordered w-full"
                autocomplete="username"
            />
          </div>

          <div v-if="name === 'root'" class="form-control">
            <label class="label py-1">
              <span class="label-text">Mot de passe</span>
            </label>
            <input
                v-model="password"
                type="password"
                placeholder="Mot de passe admin"
                class="input input-bordered w-full"
                autocomplete="current-password"
            />
          </div>

          <div v-if="error" role="alert" class="alert alert-error py-2 text-sm">
            <span>{{ error }}</span>
          </div>

          <button type="submit" class="btn btn-primary w-full mt-1 text-base h-12">
            Se connecter
          </button>

        </form>
      </div>
    </div>
  </div>
</template>