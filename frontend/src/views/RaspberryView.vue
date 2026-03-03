<script setup>
import { onMounted } from 'vue'

onMounted(async () => {
  const res = await fetch('http://localhost:3000/auth/token')
  const { access_token } = await res.json()

  window.onSpotifyWebPlaybackSDKReady = () => {
    const player = new Spotify.Player({
      name: 'Raspberry Player',
      getOAuthToken: cb => cb(access_token),
      volume: 0.8
    })

    player.connect()

    const ws = new WebSocket('ws://localhost:3000')

    ws.onmessage = (event) => {
      const { type, song } = JSON.parse(event.data)

      if (type === 'PLAY') {
        fetch(`https://api.spotify.com/v1/me/player/play`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${access_token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ uris: [`spotify:track:${song.id}`] })
        })
      }

      if (type === 'NEXT') player.nextTrack()
      if (type === 'PAUSE') player.pause()
      if (type === 'RESUME') player.resume()
    }
  }
})
</script>

<template>
  <div></div>
</template>
