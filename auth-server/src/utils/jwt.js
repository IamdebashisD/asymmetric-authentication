import path from 'path'
import fs from 'fs'

import jwt from 'jsonwebtoken'
import crypto from 'node:crypto'


export const privateKey = fs.readFileSync(
    path.join(process.cwd() , 'keys', 'private.pem'),
    'utf8'
)
export const publicKey = fs.readFileSync(
    path.join(process.cwd() , 'keys', 'public.pem'),
    'utf8'
)


export const generateAccessToken = (payload) => {
    return jwt.sign(payload, privateKey, {
        algorithm: 'RS256',
        expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m',
        keyid: process.env.JWT_KEY_ID,
        issuer: process.env.JWT_ISSUER,
        audience: process.env.JWT_AUDIENCE
    })
}

export const verifyAccessToken = (token) => {
    return jwt.verify(token, publicKey, {
        algorithms: ['RS256'],
        issuer: process.env.JWT_ISSUER,
        audience: process.env.JWT_AUDIENCE
    })
}

export const generateRefreshToken = () => {
    return crypto.randomBytes(32).toString('hex')
}

export const getRefreshTokenExpiry = () => {
    const refreshTokenExpiresInDays = Number(
        process.env.REFRESH_TOKEN_EXPIRES_IN_DAYS
    )
    return new Date (
        Date.now() + refreshTokenExpiresInDays * 24 * 60 * 60 * 1000
    )
} 

export const generateIdToken = (payload) => {
    return jwt.sign(payload, privateKey, {
        algorithm: 'RS256',
        expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m',
        keyid: process.env.JWT_KEY_ID,
        issuer: process.env.JWT_ISSUER,
        audience: process.env.JWT_AUDIENCE
    })
}