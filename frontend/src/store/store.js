import { configureStore } from "@reduxjs/toolkit"

import authReducer from "../features/authSlice"
import blogReducer from "../features/blogSlice"
import chatReducer from "../features/chatSlice"

const store = configureStore({
    reducer: {
        auth: authReducer,
        blog: blogReducer,
        chat: chatReducer
    }
})

export default store