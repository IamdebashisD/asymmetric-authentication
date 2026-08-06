import ApiError from "../utils/api-error.js";
import * as oidcService from '../services/oidc.service.js'
import ApiResponse from "../utils/api-response.js";


export const authorize = async (req, res) => {
    const {
        client_id, 
        redirect_uri, 
        response_type, 
        state, 
        scope,
        code_challenge,
        code_challenge_method
    } = req.query

    if (!req.session.userId) {
        const continueUrl = encodeURIComponent(req.originalUrl)
        return res.redirect(`http://localhost:5173/login?continue=${continueUrl}`)
    }

    const requestId = await oidcService.createAuthorizationRequest({
        clientId: client_id,
        redirectUri: redirect_uri,
        responseType: response_type,
        state,
        scope,
        codeChallenge: code_challenge,
        codeChallengeMethod: code_challenge_method,
        userId: req.user.sub
    })

    return res.redirect(`http://localhost:5173/consent?request_id=${requestId}`)
}

export const token = async (req, res) => {

    const {
        grant_type,
        code,
        refresh_token,
        client_id,
        client_secret,
        redirect_uri,
        code_verifier
    } = req.body

    if (!client_id) {
        throw ApiError.badRequest("Client ID is required")
    }
    if (!client_secret) {
        throw ApiError.badRequest("Client secret is required")
    }
    if (!grant_type) {
        throw ApiError.badRequest("Grant type is required")
    }


    if (grant_type === 'authorization_code') {
        if (!code) {
            throw ApiError.badRequest("Authorization code is required")
        }
        if (!redirect_uri) {
            throw ApiError.badRequest("Redirect URI is required")
        }
        if (!code_verifier) {
            throw ApiError.badRequest("Code verifier is required")
        }
    }

    if (grant_type === 'refresh_token') {
        if (!refresh_token) {
            throw ApiError.badRequest("Refresh token is required")
        }
    }


    if (
        grant_type != 'authorization_code' && 
        grant_type != 'refresh_token'
    ) {
        throw ApiError.badRequest(
            "Only authorization_code and refresh_token grants are supported"
        )
    }


    const token = await oidcService.token({
        grantType: grant_type,
        code,
        refreshToken: refresh_token,
        clientId: client_id,
        clientSecret: client_secret,
        redirectUri: redirect_uri,
        codeVerifier: code_verifier
    })

    ApiResponse.ok(
        res,
        'Tokens issued successfully',
        token
    )
}

export const userInfo = async (req, res) => {
    console.log(req.user)
    const user = await oidcService.userInfo(
        req.user.sub, 
        req.user.scope
    )
    
    ApiResponse.ok(res, 'User found', user)
}

export const revoke = async (req, res) => {
    const { token, client_id, client_secret } = req.body

    await oidcService.revokeToken({ 
        token, 
        clientId: client_id, 
        clientSecret: client_secret 
    })

    ApiResponse.success(res)
}