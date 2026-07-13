import ApiResponse from "../utils/api-response.js";
import * as jwksService from '../services/jwks.service.js'

export const getJWKS = async (req, res) => {
    const jwks = await jwksService.getJWKS()
    ApiResponse.ok(res, 'JWKS fetched successfully', jwks)
} 