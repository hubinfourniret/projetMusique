import { defineStore } from 'pinia'
import {formatMs} from '../utils/utils.js'

export const useQueueStore = defineStore('queue', {
    state: () => ({
        position: 0,
        duration: 0,
        isPaused: false,
        queue: [],
        currentTrack: null,
        _interval: null,
    }),

    getters: {
        progress: (state) =>
            state.duration > 0 ? (state.position / state.duration) * 100 : 0,
        elapsed: (state) => formatMs(state.position),
        total:   (state) => formatMs(state.duration),
    },

    actions: {
        connect() {
            const ws = new WebSocket('ws://localhost:3000')
            ws.onmessage = (event) => {
                const msg = JSON.parse(event.data)

                if (msg.type === 'QUEUE_UPDATE') {
                    console.log("msg", msg.queue)
                    this.queue = msg.queue
                }

                // ← nouveau : sync état player
                if (msg.type === 'PLAYER_STATE') {
                    this.syncState(msg.payload)
                }
            }
        },

        syncState({ track, position, duration, paused }) {
            this.position     = position
            this.duration     = duration
            this.isPaused     = paused
            this.currentTrack = track

            // Relance ou stoppe le timer local
            clearInterval(this._interval)
            if (!paused) {
                this._interval = setInterval(() => {
                    this.position = Math.min(this.position + 500, this.duration)
                }, 500)
            }
        },
    },
})