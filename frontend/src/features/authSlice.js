import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    user: JSON.parse(localStorage.getItem("user")) || null,
    token: localStorage.getItem("token") || null,
    isAuthenticated: !!localStorage.getItem("token"), //  convert any value into a strict boolean (true or false).
    // eg: 
    // !!"abc"	true
    // !!null	false
    loading: false,
    error: null
}

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        loginStart(state) {
            state.loading = true;
            state.error = null;
        },
        loginSuccess(state, action) {
            const { user, token } = action.payload
            state.user = user;
            state.token = token;
            state.isAuthenticated = true;
            state.loading = false;
            localStorage.setItem("user", JSON.stringify(user));
            localStorage.setItem("token", token);
        },
        loginFailure(state, action) {
            state.error = action.payload;
            state.loading = false;
        },
        logout(state) {
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
            localStorage.removeItem("token");
            localStorage.removeItem("user");
        },
        setUser(state, action) {
            state.user = action.payload;
            state.isAuthenticated = true;
            localStorage.setItem("user", JSON.stringify(action.payload))
        }
    }
})

export const { loginStart, loginFailure, loginSuccess, logout, setUser } = authSlice.actions
export default authSlice.reducer