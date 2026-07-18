import User from '../models/user.model.js'
import RefreshToken from '../models/refresh-token.model.js'
import AuthorizationCode from '../models/authorization-code.model.js'
import Client from '../models/client.model.js'
import { generateAuthorizationCode } from '../utils/oidc.js'
import { 
    generateAccessToken, 
    generateRefreshToken, 
    getRefreshTokenExpiry, 
    generateIdToken 
} from '../utils/jwt.js'
import { verifyCodeChallenge } from '../utils/pkce.js'
import ApiError from '../utils/api-error.js'


export const authorize = async ({
    clientId,
    redirectUri,
    responseType,
    state,
    scope,
    codeChallenge,
    codeChallengeMethod,
    userId,
}) => {
    if (responseType != 'code') {
        throw ApiError.badRequest(
            'Only response_type=code is supported'
        )
    }
    if (!scope) {
        throw ApiError.badRequest("Scope is required")
    }

    if (codeChallenge && !codeChallengeMethod) {
        throw ApiError.badRequest('"code_challenge_method is required"')
    }
    if (codeChallengeMethod && !codeChallenge) {
        throw ApiError.badRequest('"code_challenge is required"')
    }

    if (
        codeChallenge && codeChallengeMethod !== 'S256'
    ) {
        throw ApiError.badRequest(
            'Only S256 code_challenge_method is supported'
        )
    }
  

    const allowedScope = ["openid", "profile", "email"]
    const requestedScopes = scope.split(' ')

    if (!requestedScopes.includes("openid")) {
        throw ApiError.badRequest("openid scope is required")
    }

    for (const requestedScope of requestedScopes) {
        if (!allowedScope.includes(requestedScope)){
            throw ApiError.badRequest(`Unsupported scope: ${requestedScope}`)
        }
    }


    const code = generateAuthorizationCode()

    const expiresAt = new Date(Date.now() + 5 * 60 * 1000)

    await AuthorizationCode.create({
        code,
        user: userId,
        clientId,
        redirectUri,
        scope: requestedScopes,
        codeChallenge,
        codeChallengeMethod,
        expiresAt
    })

    return {
        redirectUri: `${redirectUri}?code=${code}&state=${state}`,
    }
}

export const token = async ({
    grantType,
    code,
    refreshToken,
    clientId,
    clientSecret,
    redirectUri,
    codeVerifier
}) => {

    const client = await Client.findOne({ clientId })

    if (!client) {
        throw ApiError.unauthorized("Invalid client")
    }
    if (client.clientSecret !== clientSecret) {
        throw ApiError.unauthorized("Invalid client secret")
    }
    if (!client.grantTypes.includes(grantType)){
        throw ApiError.badRequest(
            `${grantType} grant is not allowed for this client`
        )
    }
    
    if (grantType === 'authorization_code') {

        if (!client.redirectUris.includes(redirectUri)) {
            throw ApiError.unauthorized("Invalid redirect URI")
        }

        const authorizationCode = await AuthorizationCode.findOne({ code })

        // console.log("Found authorization code:", authorizationCode)

        if (!authorizationCode) {
            throw ApiError.unauthorized("Invalid authorization code")
        }
        if (authorizationCode.expiresAt < new Date()) {
            throw ApiError.unauthorized('Authorization code has expired')
        }
        if (authorizationCode.clientId !== clientId) {
            throw ApiError.unauthorized('Client ID does not match')
        }
        if (authorizationCode.redirectUri !== redirectUri) {
            throw ApiError.unauthorized('Redirect URI does not match')
        }

        if (!codeVerifier) {
            throw ApiError.badRequest('code_verifier is required')
        }

        const isValidChallenge =
            verifyCodeChallenge(codeVerifier, authorizationCode.codeChallenge)
        
        if (!isValidChallenge) {
            throw ApiError.unauthorized('Invalid code verifier')
        }
        
        
        const user = await User.findById(authorizationCode.user)
        if (!user) {
            throw ApiError.notFound('User not found')
        }

        const accessToken = generateAccessToken({
            sub: user._id.toString(),
            email: user.email,
            scope: authorizationCode.scope
        })

        const refreshToken = generateRefreshToken()
        
        const createRefreshToken = await RefreshToken.create({
            token: refreshToken,
            user: user._id,
            scope: authorizationCode.scope,
            expiresAt: getRefreshTokenExpiry()
        })

        console.log('Create RefreshToken : ', createRefreshToken)
        
        const idToken = generateIdToken({
            sub: user._id.toString(),
            email: user.email,
            name: user.name
        })

        await AuthorizationCode.deleteOne({
            _id: authorizationCode._id
        })

        return { accessToken, refreshToken, idToken }
    }

    if (grantType === "refresh_token") {

        /* Find the Refresh token */
        const storedRefreshToken = await RefreshToken.findOne({
            token: refreshToken
        })
        if (!storedRefreshToken) {
            throw ApiError.unauthorized("Invalid refresh token")
        }

        /* Check expiration */
        if (storedRefreshToken.expiresAt < new Date()) {
            throw ApiError.unauthorized("Refresh token has expired")
        }
        
        /* Find the User */
        const user = await User.findById(storedRefreshToken.user)
        if (!user) {
            throw ApiError.notFound("User not found")
        }

        // Generate a new access token
        const accessToken = generateAccessToken({
            sub: user._id.toString(),
            email: user.email,
            scope: storedRefreshToken.scope
        })
        // Generate a new refresh token rotation
        const newRefreshToken = generateRefreshToken()
        
        await RefreshToken.create({
            token: newRefreshToken,
            user: user._id,
            scope: storedRefreshToken.scope,
            expiresAt: getRefreshTokenExpiry()
        })

        
        await RefreshToken.deleteOne({
            _id: storedRefreshToken._id
        })

        return {
            accessToken,
            refreshToken: newRefreshToken
        }

    }

    throw ApiError.badRequest("Unsupported grant type")
}

export const userInfo = async (userId, scope) => {
    const user = await User.findById(userId)

    const claims = {
        sub: user._id.toString(),
    }

    if (scope.includes('profile')) claims.name = user.name
    if (scope.includes('email')) claims.email = user.email

    return claims
}
