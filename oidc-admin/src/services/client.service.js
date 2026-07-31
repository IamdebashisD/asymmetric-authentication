import { api } from "./api";

export const registerClient = async (data) => {
    const response = await api.post('/clients/client', data)
    return response.data
}

export const getAllClients = async () => {
    const response = await api.get('/clients')
    return response.data
}

export const getClientById = async (clientId) => {
    const response = await api.get(`clients/${clientId}`)
    return response.data
}

export const updateClient = async (clientId, data) => {
    const response = await api.put(`clients/${clientId}`, data)
    return response.data
}

export const deleteClient = async (clientId) => {
    const response = await api.delete(`clients/${clientId}`)
    return response.data
}