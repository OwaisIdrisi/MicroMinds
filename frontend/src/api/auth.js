import axios from "axios"


const API = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL
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

export const logout = (async (token) => {
    const response = await API.post(`/logout`, [], {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    return response.data
})