import { api } from "./api";

export const signUp = async (data) => {
    const response = await api.post('/auth/register', data)
    return response.data
}

export const signIn = async (data) => {
    const response = await api.post('/auth/login', data)
    return response.data
}