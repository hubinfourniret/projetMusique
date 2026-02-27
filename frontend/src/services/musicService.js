const API_URL = 'http://localhost:3000'

export async function searchTracks(query) {
    const res = await fetch(`${API_URL}/api/search?q=${encodeURIComponent(query)}`)
    if (!res.ok) throw new Error('Erreur recherche')
    return res.json()
}
