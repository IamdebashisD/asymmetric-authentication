import ApiResponse from "../utils/api-response.js";
import * as authService from '../services/auth.service.js'
import ApiError from "../utils/api-error.js";


export const register = async (req, res) => {
    const user = await authService.register(req.body)

    ApiResponse.created(res, 'Register successfully', user)
}

export const login = async (req, res) => {
    const user = await authService.login(req.body)

    console.log("JWT being stored:", user.accessToken);
    res.cookie('accessToken', user.accessToken, {
        httpOnly: true,
        secure: false,
        sameSite: 'lax'
    })

    ApiResponse.ok(res, 'Login successful', user)
}

export const refreshToken = async (req, res) => {
    const { refreshToken } = req.body
    if (!refreshToken) throw ApiError.badRequest('Refrsh token is missing')

    const {accessToken, newRefreshToken} = await authService.refreshToken(refreshToken)
    
    ApiResponse.ok(res, "Access token refreshed successfully", {
        accessToken,
        newRefreshToken
    })
}  

export const logout = async (req, res) => {
    const { refreshToken } = req.body

    if (!refreshToken) {
        throw ApiError.badRequest("Refresh token is missing");
    }

    await authService.logout(refreshToken)

    ApiResponse.ok(res, 'Logout successfully')
}

export const profile = async (req, res) => { 
    const user = await authService.profile(req.user.sub)
    ApiResponse.ok(res, 'Profile fetched successfully', user)
}