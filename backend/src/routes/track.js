import express from 'express'
import Queue from '../entities/Queue.js'
import { broadcastQueue } from '../websocket.js'
import { getFreshToken, getActiveDevice } from "./auth.js";
//import { getActiveDevice } from './player.js'

const router = express.Router()

async function spotifyQueue(uri) {
    const token = await getFreshToken()
    const activeDeviceId = await getActiveDevice()
    return await fetch(`https://api.spotify.com/v1/me/player/queue?uri=${encodeURIComponent(uri)}&device_id=${activeDeviceId}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
    })
}

router.post('/add', async (req, res) => {
    const { track } = req.body
    if (!track) return res.status(400).json({ error: 'Track invalide' })

    try {
        console.log('track', track)
        Queue.add(track)
        broadcastQueue(Queue.all)
        res.json({ success: true })
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: "Erreur lors de l'ajout" })
    }
})

router.post('/addNext', async (req, res) => {
    const { track } = req.body
    if (!track) return res.status(400).json({ error: 'Track invalide' })

    try {
        Queue.addNext(track)
        broadcastQueue(Queue.all)
        res.status(200).json({ success: true })
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: "Erreur lors de l'ajout" })
    }
})

router.delete('/delete', (req, res) => {
    const { id } = req.query
    if (!id) return res.status(400).json({ error: 'Paramètre id requis' })

    try {
        Queue.remove(id)
        broadcastQueue(Queue.all)
        res.json({ success: true })
    } catch (err) {
        res.status(500).json({ error: 'Erreur suppression' })
    }
})

export default router