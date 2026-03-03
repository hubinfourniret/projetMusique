import express from 'express'
import Queue from '../entities/Queue.js'
import { broadcastQueue } from '../websocket.js'

const router = express.Router()

router.get('/add', async (req, res) => {
    const { id } = req.query

    if (!id) return res.status(400).json({ error: 'Paramètre requis' })

    try {
        const response = await fetch(`https://api.deezer.com/track/${id}`)
        const data = await response.json()
        console.log(data)
        const track = {
            id: data.id,
            title: data.title,
            artist: data.artist.name,
            album: data.album.title,
            cover: data.album.cover_medium,
            preview: data.preview,
            duration: data.duration
        }
        Queue.add(track)
        console.log(Queue.all)
        broadcastQueue(Queue.all)
        res.json({ success: true })
    } catch (err) {
        res.status(500).json({ error: 'Erreur mauvais format' })
    }
})

router.get('/addNext', async (req, res) => {
    const { id } = req.query

    if (!id) return res.status(400).json({ error: 'Paramètre q requis' })

    try {
        const response = await fetch(`https://api.deezer.com/track/${id}`)
        const data = await response.json()

        const track = {
            id: data.id,
            title: data.title,
            artist: data.artist.name,
            album: data.album.title,
            cover: data.album.cover_medium,
            preview: data.preview,
            duration: data.duration
        }
        Queue.addNext(track)
        broadcastQueue(Queue.all)
        res.status(200).json({ success: true })
    } catch (err) {
        res.status(500).json({ error: 'Erreur Deezer API' })
    }
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
