export class Song {
    constructor(data = {}) {
        this.id = data.id ?? null
        this.title = data.title ?? ''
        this.artist = data.artist ?? ''
        this.duration = data.duration ?? 0
        this.cover = data.cover ?? ''
        this.votes = data.votes ?? 0
    }

    get formattedDuration() {
        const m = Math.floor(this.duration / 60)
        const s = this.duration % 60
        return `${m}:${s.toString().padStart(2, '0')}`
    }
}
