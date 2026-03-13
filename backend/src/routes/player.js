import express from 'express'
import { getFreshToken } from './auth.js'
import { broadcastPlayerState, broadcastToPlayer } from '../websocket.js'

const router = express.Router()
let activeDeviceId = null

export function getActiveDevice() { return activeDeviceId }

router.post('/device', (req, res) => {
    activeDeviceId = req.body.device_id
    console.log('🎧 Device enregistré:', activeDeviceId)
    res.json({ ok: true })
})

// le client connecter au sdk appel ici pour mettre a jour l'état a tous les client
router.post('/state', (req, res) => {
    broadcastPlayerState(req.body)
    console.log("réponse du jdk", req.body)
    res.json({ ok: true })
})

// tous les commandes en dessous sont les commandes uniquement faisable avec le sdk et non l'api spotify
// ces commandes sont donc appelées par les clients a fin d'envoyé les instructions au sdk, le client role player
router.post('/next', (req, res) => {
    broadcastToPlayer({ type: 'NEXT' })
    console.log("next")
    res.json({ ok: true })
})

router.post('/previous', (req, res) => {
    broadcastToPlayer({ type: 'PREV' })
    console.log("prev")
    res.json({ ok: true })
})

router.post('/toggle', (req, res) => {
    broadcastToPlayer({ type: 'TOGGLE' })
    console.log("play/pause")
    res.json({ ok: true })
})

export default router
