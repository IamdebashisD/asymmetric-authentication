import ApiResponse from "../utils/api-response.js";
import * as discoverService from '../services/discovery.service.js'

export const getConfiguration = (req, res) => {
    const configuration = discoverService.getConfiguration()

    ApiResponse.ok(
        res,
        'OIDC configuration fetched successfully',
        configuration
    )
}