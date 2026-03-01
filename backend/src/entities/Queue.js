class Queue {
    constructor(data = {}) {
        this._queue = data._queue || []
    }

    get all() {
        return this._queue
    }

    get current() {
        return this._queue[0] ?? null
    }

    add(song) {
        this._queue.push(song)
    }

    addNext(song) {
        this._queue.splice(1, 0, song)
    }

    remove(songId) {
        this._queue = this._queue.filter(s => s.id !== songId)
    }

    next() {
        this._queue.shift()
        return this.current
    }

    clear() {
        this._queue = []
    }
}

export default new Queue()
