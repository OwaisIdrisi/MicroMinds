import axios from "axios";

const API = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL
})

export const createBlog = async (data, token) => {
    const response = await API.post('/blog', data, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    return response.data
}

export const getAllBlogs = async () => {
    const response = await API.get("/blog")
    return response.data
}

export const getBlog = async (id, token) => {
    const response = await API.get(`/blog/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    return await response.data
}

export const updateBlog = async (data, id, token) => {
    const response = await API.patch(`/blog/${id}`, { data }, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    return await response.data
}

export const deleteBlog = async (id, token) => {
    const response = await API.delete(`/blog/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    return response.data
}

export const toggleLike = async (id, token) => {
    const response = await API.post(`/blog/like/${id}`, [], {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    return response.data
}