import { WebSocketServer } from 'ws'
import Queue from "./entities/Queue.js";

const clients = new Set()
let playerSocket = null

export function initWebSocket(server) {
    const wss = new WebSocketServer({ server })
    wss.on('connection', (ws, req) => {
        const isPlayer = req.url.includes('role=player')
        if (isPlayer) {
            playerSocket = ws
            console.log('Player connecté')
        } else {
            clients.add(ws)
            ws.send(JSON.stringify({ type: 'QUEUE_UPDATE', queue: Queue.all }))
        }

        ws.on('close', () => {
            if (isPlayer) playerSocket = null
            else clients.delete(ws)
        })
    })
}

// (1 = OPEN, 0 = CONNECTING, 2 = CLOSING, 3 = CLOSED)
function broadcast(data) {
    clients.forEach(client => {
        if (client.readyState === 1) {
            client.send(JSON.stringify(data))
        }
    })
}

export function broadcastToPlayer(msg) {
    if (playerSocket?.readyState === 1) {
        playerSocket.send(JSON.stringify(msg))
    } else {
        console.log("Pas de client connecter en tant que player. Donc pas de sdk disponible")
    }
}

export function broadcastPlay(song) {
    broadcast({ type: 'PLAY', song })
}

export function broadcastStop() {
    broadcast({ type: 'STOP' })
}

export function broadcastQueue(queue) {
    broadcast({ type: 'QUEUE_UPDATE', queue })
}

export function broadcastPlayerState(payload) {
    broadcast({ type: 'PLAYER_STATE', payload })
}