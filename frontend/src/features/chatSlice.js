import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    conversations: [],
    activeConversation: null,
    messages: [],
    loading: false,
    error: null,
};

const chatSlice = createSlice({
    name: "chat",
    initialState,
    reducers: {
        setChatLoading: (state, action) => {
            state.loading = action.payload;
        },
        setChatError: (state, action) => {
            state.error = action.payload;
        },
        setConversations: (state, action) => {
            state.conversations = action.payload;
            state.error = null;
        },
        setActiveConversation: (state, action) => {
            state.activeConversation = action.payload;
        },
        setMessages: (state, action) => {
            state.messages = action.payload;
            state.error = null;
        },
        clearChatState: (state) => {
            state.conversations = [];
            state.activeConversation = null;
            state.messages = [];
            state.loading = false;
            state.error = null;
        },
    },
});

export const {
    setChatLoading,
    setChatError,
    setConversations,
    setActiveConversation,
    setMessages,
    clearChatState,
} = chatSlice.actions;

export default chatSlice.reducer;
