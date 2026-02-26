export function setCookie(key, value, days = 30) {
    const expires = new Date()
    expires.setDate(expires.getDate() + days)
    document.cookie = `${key}=${value};expires=${expires.toUTCString()};path=/`
}

export function getCookie(key) {
    const match = document.cookie
        .split('; ')
        .find(row => row.startsWith(`${key}=`))
    return match ? match.split('=')[1] : null
}