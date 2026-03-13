import { onUnmounted, ref } from 'vue'

export function useSpotifyPlayer() {
    const player = ref(null)
    const deviceId = ref(null)
    const currentTrack = ref(null)
    const isPaused = ref(true)
    const isReady = ref(false)

    function init() {
        window.onSpotifyWebPlaybackSDKReady = async () => {
            player.value = new window.Spotify.Player({
                name: 'Jukebox Appart 🎵',
                getOAuthToken: async cb => {
                    const res = await fetch('http://localhost:3000/api/auth/token')
                    const { access_token } = await res.json()
                    cb(access_token)
                },
                volume: 0.8,
            })

            player.value.addListener('ready', ({ device_id }) => {
                console.log('🎧 Player prêt, device_id:', device_id)
                deviceId.value = device_id
                isReady.value = true
                fetch('http://localhost:3000/api/player/device', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ device_id: String(device_id) }),
                })
            })

            player.value.addListener('not_ready', () => {
                console.warn('⚠️ Device déconnecté')
                isReady.value = false
            })

            // Envoie l'état au back après chaque changement → broadcast à tous les clients
            player.value.addListener('player_state_changed', state => {
                if (!state) return
                currentTrack.value = state.track_window.current_track
                isPaused.value = state.paused
                fetch('http://localhost:3000/api/player/state', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        track: state.track_window.current_track,
                        position: state.position,
                        duration: state.duration,
                        paused: state.paused,
                    }),
                })
            })

            player.value.addListener('initialization_error', ({ message }) =>
                console.error('Init error:', message))
            player.value.addListener('authentication_error', ({ message }) =>
                console.error('Auth error:', message))
            player.value.addListener('account_error', ({ message }) =>
                console.error('Account error (Premium requis ?):', message))

            player.value.connect()

            // ← AJOUT : WebSocket identifié comme "player" pour recevoir les commandes
            const ws = new WebSocket('ws://localhost:3000?role=player')

            ws.onmessage = async (event) => {
                const { type } = JSON.parse(event.data)
                console.log('📨 Commande reçue:', type)

                if (type === 'NEXT')   await player.value.nextTrack()
                if (type === 'PREV')   await player.value.previousTrack()
                if (type === 'TOGGLE') {
                    const state = await player.value.getCurrentState()
                    if (!state) return
                    state.paused
                        ? await player.value.resume()
                        : await player.value.pause()
                }
            }

            ws.onclose = () => console.warn('⚠️ WS Player déconnecté')
        }

        if (!document.getElementById('spotify-sdk')) {
            const script = document.createElement('script')
            script.id = 'spotify-sdk'
            script.src = 'https://sdk.scdn.co/spotify-player.js'
            document.head.appendChild(script)
        }
    }

    onUnmounted(() => player.value?.disconnect())

    return { player, deviceId, currentTrack, isPaused, isReady, init }
}
