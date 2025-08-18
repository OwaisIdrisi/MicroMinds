import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    blogs: [],
    loading: false,
    error: null,
    isError: false,
    myBlogs: [],
}

const blogSlice = createSlice({
    name: "blog",
    initialState,
    reducers: {
        setBlogs: (state, action) => {
            state.blogs = action.payload
            state.error = null
            state.isError = false
            state.loading = false
        },
        setBlog: (state, action) => {
            // state.blogs.push(action.payload)
            state.blogs.unshift(action.payload)
            state.error = null
            state.isError = false
            state.loading = false
        },
        blogFailure: (state, action) => {
            state.isError = true
            state.error = action.payload
            state.loading = false
        },
        setError: (state, action) => {
            state.isError = true
            state.error = action.payload
            state.loading = false
        },
        setMyBlogs: (state, action) => {
            state.myBlogs = action.payload
            state.error = null
            state.isError = false
            state.loading = false
        },
        setLoading: (state, action) => {
            state.loading = action.payload
        },


    }
})

export const { setBlogs, blogFailure, setError, setBlog, setMyBlogs, setLoading } = blogSlice.actions
export default blogSlice.reducer