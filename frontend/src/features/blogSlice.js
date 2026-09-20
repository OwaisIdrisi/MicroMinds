import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    blogs: [],
    loading: false,
    myBlogsLoading: false,
    error: null,
    isError: false,
    myBlogs: [],
    pagination: {
        page: 1,
        limit: 9,
        totalBlogs: 0,
        totalPages: 1,
    },
    myBlogsPagination: {
        page: 1,
        limit: 9,
        totalBlogs: 0,
        totalPages: 1,
    },
    filters: {
        search: "",
        tag: "",
        sort: "latest",
    },
    myBlogsFilters: {
        search: "",
        sort: "latest",
    },
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
            state.myBlogsLoading = false
        },
        setMyBlogsLoading: (state, action) => {
            state.myBlogsLoading = action.payload
        },
        setMyBlogsPagination: (state, action) => {
            state.myBlogsPagination = { ...state.myBlogsPagination, ...action.payload }
        },
        setMyBlogsFilters: (state, action) => {
            state.myBlogsFilters = { ...state.myBlogsFilters, ...action.payload }
        },
        resetMyBlogsFilters: (state) => {
            state.myBlogsFilters = {
                search: "",
                sort: "latest",
            }
            state.myBlogsPagination.page = 1
        },
        setLoading: (state, action) => {
            state.loading = action.payload
        },
        setPagination: (state, action) => {
            state.pagination = { ...state.pagination, ...action.payload }
        },
        setFilters: (state, action) => {
            state.filters = { ...state.filters, ...action.payload }
        },
        resetFilters: (state) => {
            state.filters = {
                search: "",
                tag: "",
                sort: "latest",
            }
            state.pagination.page = 1
        },
    }
})

export const {
    setBlogs,
    blogFailure,
    setError,
    setBlog,
    setMyBlogs,
    setMyBlogsLoading,
    setMyBlogsPagination,
    setMyBlogsFilters,
    resetMyBlogsFilters,
    setLoading,
    setPagination,
    setFilters,
    resetFilters,
} = blogSlice.actions
export default blogSlice.reducer