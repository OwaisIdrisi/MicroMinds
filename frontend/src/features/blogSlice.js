import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    blogs: [],
    loading: false,
    error: null,
    isError: false,
    myLocalBlog: []
}

const blogSlice = createSlice({
    name: "blog",
    initialState,
    reducers: {
        setBlogs: (state, action) => {
            state.blogs = action.payload
        },
        setBlog: (state, action) => {
            state.blogs.push(action.payload)
        },
        blogFailure: (state, action) => {
            state.error = action.payload
        },
        setIsError: (state, action) => {
            state.isError = action.payload
        }
    }
})

export const { setBlogs, blogFailure, setIsError, setBlog } = blogSlice.actions
export default blogSlice.reducer