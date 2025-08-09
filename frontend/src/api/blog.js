import axios from "axios";

const API = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL,
    withCredentials: true
})

export const createBlog = async (data) => {
    const response = await API.post('/blog', data)
    return response.data
}

export const getAllBlogs = async () => {
    const response = await API.get("/blog")
    return response.data
}

export const getBlog = async (id) => {
    const response = await API.get(`/blog/${id}`)
    return await response.data
}

export const updateBlog = async (data, id) => {
    const response = await API.patch(`/blog/${id}`, { data })
    return await response.data
}

export const deleteBlog = async (id) => {
    const response = await API.delete(`/blog/${id}`)
    return response.data
}

export const toggleLike = async (id) => {
    const response = await API.post(`/blog/like/${id}`)
    return response.data
}