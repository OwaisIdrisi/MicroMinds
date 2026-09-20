import axios from "axios";
import protectedRequest from "./protectedRequest ";

const API = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL,
    withCredentials: true,
});

export const getConversations = () => protectedRequest(async () => {
    const response = await API.get('/chat/conversations');
    return response.data;
});

export const startConversation = (userId) => protectedRequest(async () => {
    const response = await API.post('/chat/start', { userId });
    return response.data;
});

export const getConversation = (conversationId) => protectedRequest(async () => {
    const response = await API.get(`/chat/${conversationId}`);
    return response.data;
});

export const sendMessage = (conversationId, text) => protectedRequest(async () => {
    const response = await API.post(`/chat/${conversationId}/message`, { text });
    return response.data;
});

export const getUserByUsername = (username) => protectedRequest(async () => {
    const response = await API.get(`/users/${username}`);
    return response.data;
});
