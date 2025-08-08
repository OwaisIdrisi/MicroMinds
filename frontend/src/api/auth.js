import axios from "axios"
import protectedRequest from "./protectedRequest ";

export const API = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL,
    withCredentials: true,
})


export const login = async (data) => {
    console.log(import.meta.env.VITE_BASE_URL);
    const response = await API.post(`/login`, data)
    return response.data
}

export const register = async (data) => {
    const response = await API.post(`/register`, data)
    return response.data
}

export const logout = (async () => {
    const response = await API.post(`/logout`)
    return response.data
})

export const getCurrentUser = () =>
    protectedRequest(async () => {
        const response = await API.get('/me')
        return response.data
    })

export const refreshAccessToken = async () => {
    const response = await API.post('/refresh-token')
    return response.data
}