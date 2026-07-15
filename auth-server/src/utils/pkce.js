import crypto from 'node:crypto'

export const generateCodeChallenge = (codeVerifier) => {
    return crypto
        .createHash('sha256')
        .update(codeVerifier)
        .digest('base64url')
}

export const verifyCodeChallenge = (codeVerifier, storeCodeChallenge) => {
    const generatedCodeChallenge = generateCodeChallenge(codeVerifier)
    return generatedCodeChallenge === storeCodeChallenge
}
