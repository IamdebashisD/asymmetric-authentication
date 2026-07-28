import crypto from 'crypto'
import Client from '../models/client.model.js'
import ApiError from '../utils/api-error.js'


export const registerClient = async ({ name, redirectUris }) => {
    const existingClient = await Client.findOne({ name })

    if (existingClient) {
        throw ApiError.conflict('Client already exists')
    }

    const clientId = crypto.randomUUID()
    const clientSecret = crypto.randomBytes(32).toString('hex')

    const client = await Client.create({ clientId, clientSecret, name, redirectUris })

    return {
        clientId: client.clientId,
        clientSecret: client.clientSecret,
        name: client.name,
        redirectUris: client.redirectUris 
    }
}

export const getAllClients = async () => {
    return await Client.find().sort({ createdAt: -1 })
}

export const getClientById = async (clientId) => {
    const client = await Client.findOne({ clientId })
    
    if (!client) {
        throw ApiError.notFound('Client not found')
    }

    return client
}

export const updateClient = async (clientId, data) => {
    if (Object.keys(data).length === 0) {
        throw ApiError.badRequest('Client data is required')
    }

    const client = await Client.findOne({ clientId })
    if (!client) {
        throw ApiError.notFound('Client not found')
    }

    client.name = data.name
    client.redirectUris = data.redirectUris
    client.grantTypes = data.grantTypes
    client.responseTypes = data.responseTypes
    client.scopes = data.scopes

    await client.save()

    return client
}

export const deleteClient = async (clientId) => {
    if (!clientId) {
        throw ApiError.badRequest('Client ID is required')
    }

    const client = await Client.findOne({ clientId })

    if (!client) {
        throw ApiError.notFound('Client not found')
    }

    await Client.deleteOne({ clientId })

    return
}