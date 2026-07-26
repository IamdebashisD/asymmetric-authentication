import * as clientService from '../services/client.service.js'
import ApiResponse from '../utils/api-response.js'
import ApiError from '../utils/api-error.js'


export const createClient = async (req, res) => {
    if (!req) throw ApiError.badRequest('Client data is missing')
    
    const client = await clientService.registerClient(req.body)

    ApiResponse.created(
        res, 
        "Client registered successfully", 
        client
    )
}

