import { WebSocketServer } from 'ws'

let wss = null

export function initWebSocket(server) {
    wss = new WebSocketServer({ server })
}

// (1 = OPEN, 0 = CONNECTING, 2 = CLOSING, 3 = CLOSED)
export function broadcastQueue(queue) {
    wss.clients.forEach(client => {
        if (client.readyState === 1) {
            client.send(JSON.stringify({ type: 'QUEUE_UPDATE', queue }))
        }
    })
}
