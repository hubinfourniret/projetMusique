import express from 'express';
import { getFreshToken } from './auth.js';

const router = express.Router();

router.get('/', async (req, res) => {
    const { q } = req.query;
    if (!q) return res.status(400).json({ error: 'Paramètre q requis' });

    try {
        const token = await getFreshToken();

        const response = await fetch(
            `https://api.spotify.com/v1/search?q=${encodeURIComponent(q)}&type=track&limit=10&market=FR`,
            {
                headers: { Authorization: `Bearer ${token}` },
            }
        );

        const data = await response.json();

        console.log("data", data);

        const tracks = data.tracks.items.map(track => ({
            id: track.id,
            title: track.name,
            artist: track.artists[0].name,
            album: track.album.name,
            cover: track.album.images[0]?.url,
            preview: track.preview_url,
            duration: track.duration_ms,
            uri: track.uri,
        }));

        res.json(tracks);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erreur Spotify API' });
    }
});

export default router;
