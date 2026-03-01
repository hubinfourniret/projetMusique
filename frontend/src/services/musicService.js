import {ref} from "vue";

const API_URL = 'http://localhost:3000'

export async function searchTracks(query) {
    const res = await fetch(`${API_URL}/api/search?q=${encodeURIComponent(query)}`)
    if (!res.ok) throw new Error('Erreur recherche')
    return res.json()
}

export async function add(songId) {
    const res = await fetch(`${API_URL}/api/track/add?q=${encodeURIComponent(songId)}`)
    if (!res.ok) throw new Error("Erreur d'ajout")
    return res.json()
}

export async function addNext(songId) {
    const res = await fetch(`${API_URL}/api/track/addNext?q=${encodeURIComponent(songId)}`)
    if (!res.ok) throw new Error("Erreur d'ajout")
    return res.json()
}

export const currentSong = ref(null)

export function setCurrentSong(track) {
    currentSong.value = track;
}