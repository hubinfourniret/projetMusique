import express from 'express'
import Queue from '../entities/Queue.js'
import { broadcastQueue } from '../websocket.js'
import {getActiveDevice, getFreshToken} from "./auth.js";

const router = express.Router()



async function spotifyQueue(uri) {
    const token = await getFreshToken()
    const activeDeviceId = await getActiveDevice()
    console.log("token",token, activeDeviceId)
    return await fetch(`https://api.spotify.com/v1/me/player/queue?uri=${encodeURIComponent(uri)}&device_id=${activeDeviceId}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
    })
}

router.get('/devices', async (req, res) => {
    const token = await getFreshToken()
    console.log("token",token)
    const r = await fetch('https://api.spotify.com/v1/me/player/devices', {
        headers: { Authorization: `Bearer ${token}` },
    })
    const data = await r.json()
    res.send(data)
})

router.post('/add', async (req, res) => {
    const { track } = req.body
    if (!track) return res.status(400).json({ error: 'Track invalide' })

    try {
        Queue.add(track)
        await spotifyQueue(track)
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
        await spotifyQueue(track)
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