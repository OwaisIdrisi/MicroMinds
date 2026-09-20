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

export const getAllBlogs = ({ page = 1, limit = 9, search = "", tag = "", sort = "latest" } = {}) => protectedRequest(async () => {
    const params = new URLSearchParams();
    params.set("page", String(page));
    params.set("limit", String(limit));

    if (search) params.set("search", search);
    if (tag) params.set("tag", tag);
    if (sort) params.set("sort", sort);

    const response = await API.get(`/blog?${params.toString()}`)
    return response.data.data
})

export const getMyBlogs = ({ page = 1, limit = 9, search = "", sort = "latest" } = {}) => protectedRequest(async () => {
    const params = new URLSearchParams();
    params.set("page", String(page));
    params.set("limit", String(limit));

    if (search) params.set("search", search);
    if (sort) params.set("sort", sort);

    const response = await API.get(`/blog/my?${params.toString()}`)
    return response.data.data
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

export const getComments = (blogId) => protectedRequest(async () => {
    const response = await API.get(`/blog/${blogId}/comments`)
    return response.data
})

export const addComment = (blogId, text) => protectedRequest(async () => {
    const response = await API.post(`/blog/${blogId}/comments`, { text })
    return response.data
})

export const deleteComment = (blogId, commentId) => protectedRequest(async () => {
    const response = await API.delete(`/blog/${blogId}/comments/${commentId}`)
    return response.data
})

export const detectAiContent = (text) => protectedRequest(async () => {
    const response = await API.post('/ai-detect', { text })
    return response.data
})