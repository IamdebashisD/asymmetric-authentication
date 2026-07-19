export async function generatePKCE() {
    const random = new Uint8Array(32)
    crypto.getRandomValues(random)

    const codeVerifier = base64UrlEncode(random)

    const encoder = new TextEncoder()
    const data = encoder.encode(codeVerifier)

    const digest = await crypto.subtle.digest('SHA-256', data)

    const codeChallenge = base64UrlEncode(new Uint8Array(digest))

    return {
        codeVerifier,
        codeChallenge
    }
}

function base64UrlEncode(bytes) {
    return btoa(String.fromCharCode(...bytes))
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/, "")
}