import express from 'express'
import Queue from '../entities/Queue.js'
import { broadcastQueue } from '../websocket.js'

const router = express.Router()

router.post('/add', async (req, res) => {
    const { q } = req.query

    if (!q) return res.status(400).json({ error: 'Paramètre q requis' })

    try {
        const track = {
            id: q.id,
            title: q.title,
            artist: q.artist.name,
            album: q.album.title,
            cover: q.album.cover_medium,
            preview: q.preview,
            duration: q.duration
        }
        Queue.add(track)
        broadcastQueue(Queue.all)
        res.json({ success: true })
    } catch (err) {
        res.status(500).json({ error: 'Erreur mauvais format' })
    }
})

router.post('/addNext', async (req, res) => {
    const { id } = req.query

    if (!id) return res.status(400).json({ error: 'Paramètre q requis' })

    try {
        const response = await fetch(`https://api.deezer.com/track/${id}`)
        const data = await response.json()

        const tracks = data.data.map(track => ({
            id: track.id,
            title: track.title,
            artist: track.artist.name,
            album: track.album.title,
            cover: track.album.cover_medium,   // image pochette
            preview: track.preview,            // extrait 30s MP3
            duration: track.duration
        }))

        res.status(200).json({ success: true })
    } catch (err) {
        res.status(500).json({ error: 'Erreur Deezer API' })
    }

    Queue.addNext(track)
    broadcastQueue(Queue.all)
})

router.delete('/delete', async (req, res) => {
    const { q } = req.query

    if (!q) return res.status(400).json({ error: 'Paramètre q requis' })

    try {
        const track = {
            id: q.id,
            title: q.title,
            artist: q.artist.name,
            album: q.album.title,
            cover: q.album.cover_medium,
            preview: q.preview,
            duration: q.duration
        }
        Queue.remove(track)
        broadcastQueue(Queue.all)
        res.json({ success: true })
    } catch (err) {
        res.status(500).json({ error: 'Erreur mauvais format' })
    }
})



export default router
