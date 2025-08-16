import axios from "axios";
import protectedRequest from "./protectedRequest ";

const API = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL,
    withCredentials: true
})

export const createBlog = (data) => protectedRequest(async () => {
    const response = await API.post('/blog', data)
    return response.data
})

export const getAllBlogs = () => protectedRequest(async () => {
    const response = await API.get("/blog")
    return response.data
})


export const getBlog = (id) => protectedRequest(async () => {
    const response = await API.get(`/blog/${id}`)
    return await response.data
})

export const updateBlog = (data, id) => protectedRequest(async () => {
    const response = await API.patch(`/blog/${id}`, data)
    return await response.data
})

export const deleteBlog = (id) => protectedRequest(async () => {
    const response = await API.delete(`/blog/${id}`)
    return response.data
})

export const toggleLike = (id) => protectedRequest(async () => {
    const response = await API.post(`/blog/like/${id}`)
    return response.data
})