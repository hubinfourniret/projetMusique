const express = require('express')
const router = express.Router()

router.get('', async (req, res) => {
    const { q } = req.query

    if (!q) return res.status(400).json({ error: 'Paramètre q requis' })

    try {
        const response = await fetch(
            `https://api.deezer.com/search?q=${encodeURIComponent(q)}&limit=20`
        )
        const data = await response.json()

        // On ne retourne que ce qui est utile
        const tracks = data.data.map(track => ({
            id: track.id,
            title: track.title,
            artist: track.artist.name,
            album: track.album.title,
            cover: track.album.cover_medium,   // image pochette
            preview: track.preview,            // extrait 30s MP3
            duration: track.duration
        }))

        res.json(tracks)
    } catch (err) {
        res.status(500).json({ error: 'Erreur Deezer API' })
    }
})

module.exports = router
