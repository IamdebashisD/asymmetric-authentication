import * as clientService from '../services/client.service.js'
import ApiResponse from '../utils/api-response.js'
import ApiError from '../utils/api-error.js'


export const createClient = async (req, res) => {
    if (!req) throw ApiError.badRequest('Client data is missing')
    
    const client = await clientService.registerClient(req.body)

    ApiResponse.created(
        res, 
        'Client registered successfully', 
        client
    )
}

export const getAllClients = async (req, res) => {
    const clients = await clientService.getAllClients()

    ApiResponse.ok(
        res,
        'Clients fetched successfully',
        clients
    )
}

export const getClientById = async (req, res) => {
    const client = await clientService.getClientById(req.params.clientId)
    console.log(client)
    ApiResponse.ok(
        res,
        'Client fetched successfully',
        client
    )
}

export const updateClient = async (req, res) => {
    if (!req) throw ApiError.badRequest('Client information is missing')

    const client = await clientService.updateClient(req.params.clientId, req.body)

    ApiResponse.ok(
        res,
        'Client updated successfully',
        client
    )
}

export const deleteClient = async (req, res) => {
    await clientService.deleteClient(req.params.clientId)

    ApiResponse.ok(
        res,
        'Client deleted successfully',
    )
}

