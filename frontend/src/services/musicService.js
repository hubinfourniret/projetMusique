import {ref} from "vue";

const API_URL = 'http://localhost:3000'

export async function searchTracks(query) {
    const res = await fetch(`${API_URL}/api/search?q=${encodeURIComponent(query)}`)
    if (!res.ok) throw new Error('Erreur recherche')
    return res.json()
}

export async function add(track) {
    const res = await fetch(`${API_URL}/api/track/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ track }),
    })
    if (!res.ok) throw new Error("Erreur d'ajout")
    return res.json()
}

export async function addNext(track) {
    const res = await fetch(`${API_URL}/api/track/addNext`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ track }),
    })
    if (!res.ok) throw new Error("Erreur d'ajout")
    return res.json()
}

export async function removeTrack(trackId) {
    const res = await fetch(`${API_URL}/api/track/delete?id=${trackId}`, {
        method: 'DELETE',
    })
    if (!res.ok) throw new Error('Erreur suppression')
    return res.json()
}

export async function next() {
    const res = await fetch(`${API_URL}/api/player/next`, {
        method: 'POST',
    })
    if (!res.ok) throw new Error('Erreur suppression')
    return res.json()
}

export async function prev() {
    const res = await fetch(`${API_URL}/api/player/previous`, {
        method: 'POST',
    })
    if (!res.ok) throw new Error('Erreur suppression')
    return res.json()
}

export async function toggle() {
    const res = await fetch(`${API_URL}/api/player/toggle`, {
        method: 'POST',
    })
    if (!res.ok) throw new Error('Erreur suppression')
    return res.json()
}