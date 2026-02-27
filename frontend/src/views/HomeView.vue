<script setup>
import Search from "@/components/Search.vue";

const props = defineProps({
  setCurrentSong: {
    type: Function,
    required: true,
  }});
</script>

<template>
  <Search :onSelect="props.setCurrentSong" />
</template>