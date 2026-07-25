import User from '../models/user.model.js'
import ApiError from '../utils/api-error.js'
import { verifyAccessToken } from '../utils/jwt.js'

const redirectToLogin = (req, res) => {
    return res.redirect(
        `http://localhost:5173/login?continue=${encodeURIComponent(req.originalUrl)}`
    )
}

export const authMiddleware = async (req, res, next) => {
    if (req.session?.userId) {
        const user = await User.findById(req.session.userId).select('_id email')

        if (user) {
            req.user = {
                sub: user._id.toString(),
                email: user.email
            }

            return next()
        }
        
        req.session.destroy(() => {})
    }

    const header = req.headers['authorization']
    const accessToken = req.cookies.accessToken

    let token

    if (accessToken) {
        token = accessToken;
    } else if (header?.startsWith("Bearer ")) {
        token = header.split(" ")[1];
    }
    
    if (!token) {
        if (req.path === '/authorize') {
            return redirectToLogin(req, res)
        }
    }
    
    try {
        const decoded = verifyAccessToken(token)
        console.log(decoded)
        req.user = decoded
        next()
    } catch (error) {
        console.error(error);
        if (req.path === '/authorize') {
            return redirectToLogin(req, res)
        }
        throw ApiError.unauthorized("Invalid or expired access token")
    }
}