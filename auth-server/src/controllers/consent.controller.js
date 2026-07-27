import * as oidcService from '../services/oidc.service.js'
import ApiResponse from '../utils/api-response.js'

export const getConsent = async (req, res) => {
    const { requestId } = req.params

    const data = await oidcService.getAuthorizationRequest(requestId)

    ApiResponse.ok(res, 'Authorization request found', data)
}

export const approveConsent = async (req, res) => {
    const { requestId } = req.params

    const result = await oidcService.approveAuthorizationRequest(requestId)

    return res.redirect(result.redirectUri)
}

export const denyConsent = async (req, res) => {
    const { requestId } = req.params

    const result = await oidcService.denyAuthorizationRequest(requestId)

    return res.redirect(result.redirectUri)
}