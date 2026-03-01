import { defineStore } from 'pinia'

export const useQueueStore = defineStore('queue', {
    state: () => ({
        queue: [],
    }),
    actions: {
        connect() {
            const ws = new WebSocket('ws://localhost:3000')
            ws.onmessage = (event) => {
                const { type, queue } = JSON.parse(event.data)
                if (type === 'QUEUE_UPDATE') {
                    this.queue = queue
                }
            }
        }
    }
})
