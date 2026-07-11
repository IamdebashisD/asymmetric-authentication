import ApiError from '../utils/api-error.js'
import { verifyAccessToken } from '../utils/jwt.js'

export const authMiddleware = (req, res, next) => {
    const header = req.headers['authorization']

    if (!header) {
        throw ApiError.unauthorized("Authorization header is missing")
    }

    if (!header.startsWith('Bearer ')) {
        throw ApiError.unauthorized('Authorization header must start with "Bearer "')
    }
    const [, token] = header.split(' ')

    if (!token) {
        throw ApiError.unauthorized(
            'Authorization token is missing'
        )
    }

    try {
        const decoded = verifyAccessToken(token)
        req.user = decoded
        next()
    } catch (error) {
        throw ApiError.unauthorized("Invalid or expired access token")
    }
}