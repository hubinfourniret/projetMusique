<script setup>
import { onMounted } from 'vue'

onMounted(() => {
  DZ.init({
    appId: 'TON_APP_ID',
    channelUrl: 'http://localhost:5173/channel.html',
  })

  const ws = new WebSocket('ws://localhost:3000')

  ws.onmessage = (event) => {
    const { type, song } = JSON.parse(event.data)

    if (type === 'PLAY') DZ.player.playTracks([song.id])
    if (type === 'NEXT') DZ.player.next()
    if (type === 'PAUSE') DZ.player.pause()
  }
})
</script>

<template>
  <div id="dz-root"></div>
</template>
