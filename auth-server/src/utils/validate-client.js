import Client from '../models/client.model.js'
import ApiError from './api-error.js'

export const validateClient = async (clientId, clientSecret) => {
    const client = await Client.findOne({ clientId })

    if (!client) throw ApiError.unauthorized('Invalid client')

    if (client.clientSecret !== clientSecret) {
        throw ApiError.unauthorized('Invalid client secret')
    }
    
    return client
}