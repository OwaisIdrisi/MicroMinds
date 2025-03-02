import axios from "axios"

const url = "http://localhost:8000/api"

export const fetchPosts = () => axios.get(`${url}/posts`)

export const login = async (formData) => {
    const response = await axios.post(`${url}/login`, formData)
    const data = await response.data.data
    console.log("data", data);

    return response
}

