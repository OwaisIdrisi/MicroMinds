import axios from "axios"

const url = "http://localhost:8000/api"

export const fetchPosts = () => axios.get(`${url}/posts`)

export const login = async (formData) => {
    const response = await axios.post(`${url}/login`, formData)
    const data = await response.data.data

    // change code in future
    if (!response.data.success) {
        console.log("resp", response.data)
        return null
    }
    document.cookie = `refreshToken=${data.refreshToken}; path=/; max-age=604800; Sucure; sameSite=Strict`
    document.cookie = `accessToken=${data.accessToken}; path=/; max-age=604800; Sucure; sameSite=Strict`
    localStorage.setItem("accessToken", data.accessToken)
    return data
}

export const getUser = async (accessToken) => {
    try {
        const resp = await axios.get(`${url}/me`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        })
        const data = await resp.data
        return data;
    } catch (error) {
        console.error("Error fetching user data:", error);
        return null;
    }
}

