import {onUnmounted, ref} from 'vue'

export function useSpotifyPlayer() {
    const player = ref(null)
    const deviceId = ref(null)
    const currentTrack = ref(null)
    const isPaused = ref(true)
    const isReady = ref(false)

    function init() {
        window.onSpotifyWebPlaybackSDKReady = async () => {
            const res = await fetch('http://localhost:3000/auth/token')
            const token = await res.json()

            player.value = new window.Spotify.Player({
                name: 'Jukebox Appart 🎵',
                getOAuthToken: async cb => {
                    // Rappelle ton back pour avoir un token frais à chaque fois
                    cb(token)
                },
                volume: 0.8,
            })

            // Device prêt → enregistre l'id côté back
            player.value.addListener('ready', ({ device_id }) => {
                console.log('🎧 Player prêt, device_id:', device_id)
                deviceId.value = device_id
                isReady.value = true

                fetch('/api/track/device', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ device_id: String(device_id) }),
                })
            })

            // Device déconnecté
            player.value.addListener('not_ready', ({ device_id }) => {
                console.warn('⚠️ Device déconnecté:', device_id)
                isReady.value = false
            })

            // Mise à jour de l'état de lecture
            player.value.addListener('player_state_changed', state => {
                if (!state) return
                currentTrack.value = state.track_window.current_track
                isPaused.value = state.paused
            })

            // Erreurs
            player.value.addListener('initialization_error', ({ message }) =>
                console.error('Init error:', message)
            )
            player.value.addListener('authentication_error', ({ message }) =>
                console.error('Auth error:', message)
            )
            player.value.addListener('account_error', ({ message }) =>
                console.error('Account error (Premium requis ?):', message)
            )

            player.value.connect()
        }

        // Injecte le script SDK si pas encore présent
        if (!document.getElementById('spotify-sdk')) {
            const script = document.createElement('script')
            script.id = 'spotify-sdk'
            script.src = 'https://sdk.scdn.co/spotify-player.js'
            document.head.appendChild(script)
        }
    }

    // Nettoyage quand le composant est démonté
    onUnmounted(() => {
        player.value?.disconnect()
    })

    return { player, deviceId, currentTrack, isPaused, isReady, init }
}
