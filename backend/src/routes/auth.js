import express from 'express'
import 'dotenv/config'

const router = express.Router()

let cachedToken = null
let tokenExpiresAt = 0

export async function getFreshToken() {
    if (cachedToken && Date.now() < tokenExpiresAt - 60_000) {
        return cachedToken
    }

    const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: 'Basic ' + Buffer.from(
                process.env.SPOTIFY_CLIENT_ID + ':' + process.env.SPOTIFY_CLIENT_SECRET
            ).toString('base64'),
        },
        body: new URLSearchParams({
            grant_type: 'refresh_token',
            refresh_token: process.env.SPOTIFY_REFRESH_TOKEN,
        }),
    })

    const data = await response.json()

    if (!response.ok || !data.access_token) {
        console.error('Spotify token error:', data)
        throw new Error(`Impossible de rafraîchir le token Spotify : ${data.error_description ?? data.error}`)
    }
    cachedToken = data.access_token
    tokenExpiresAt = Date.now() + data.expires_in * 1000
    return cachedToken
}

export async function getActiveDevice() {
    const token = await getFreshToken()
    console.log("token",token)
    const r = await fetch('https://api.spotify.com/v1/me/player/devices', {
        headers: { Authorization: `Bearer ${token}` },
    })
    const data = await r.json()
    if(data.devices[0]?.id){
        var res = data.devices[0]?.id
    } else {
        res = 0
        console.error('No device found')
    }
    return res
}

// Étape 1 — Tu ouvres cette URL dans ton navigateur une seule fois
router.get('/login', (req, res) => {
    const params = new URLSearchParams({
        response_type: 'code',
        client_id: process.env.SPOTIFY_CLIENT_ID,
        scope: 'streaming user-read-email user-read-private user-modify-playback-state user-read-playback-state',
        redirect_uri: process.env.SPOTIFY_REDIRECT_URI,
    })
    res.redirect(`https://accounts.spotify.com/authorize?${params}`)
})

// Étape 2 — Spotify appelle cette route automatiquement après connexion
router.get('/callback', async (req, res) => {
    const code = req.query.code

    const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + Buffer.from(
                process.env.SPOTIFY_CLIENT_ID + ':' + process.env.SPOTIFY_CLIENT_SECRET
            ).toString('base64')
        },
        body: new URLSearchParams({
            grant_type: 'authorization_code',
            code,
            redirect_uri: process.env.SPOTIFY_REDIRECT_URI,
        })
    })

    const data = await response.json()
    // Affiche le refresh_token dans le navigateur pour que tu puisses le copier
    res.json(data)
})

// Étape 3 — Le front appelle cette route pour avoir un token frais
router.get('/token', async (req, res) => {
    const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + Buffer.from(
                process.env.SPOTIFY_CLIENT_ID + ':' + process.env.SPOTIFY_CLIENT_SECRET
            ).toString('base64')
        },
        body: new URLSearchParams({
            grant_type: 'refresh_token',
            refresh_token: process.env.SPOTIFY_REFRESH_TOKEN,
        })
    })

    const data = await response.json()
    res.json({ access_token: data.access_token })
})

export default router
