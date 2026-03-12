<script setup>
defineProps({
  username: { type: String }
})
</script>

<template>
  <div class="navbar bg-base-100 shadow-md px-4 z-50 flex items-center justify-center">

    <div class="flex-1">
      <span class="text-lg font-bold">Musique</span>
    </div>

    <div class="flex-none flex items-center gap-2">
      <span class="text-sm font-medium xs:block">{{ username }}</span>
      <div class="avatar placeholder">
        <div class="bg-primary text-primary-content rounded-full w-9 h-9 flex items-center justify-center">
          <span class="text-sm font-bold">
            {{ username.charAt(0).toUpperCase() }}
          </span>
        </div>
      </div>
    </div>

  </div>
</template>