import { WebSocketServer } from 'ws'
import Queue from "./entities/Queue.js";

let wss = null

export function initWebSocket(server) {
    wss = new WebSocketServer({ server })
    wss.on('connection', (client) => {
        client.send(JSON.stringify({ type: 'QUEUE_UPDATE', queue: Queue.all }))
    })
}

// (1 = OPEN, 0 = CONNECTING, 2 = CLOSING, 3 = CLOSED)
function broadcast(data) {
    wss.clients.forEach(client => {
        if (client.readyState === 1) {
            client.send(JSON.stringify(data))
        }
    })
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
