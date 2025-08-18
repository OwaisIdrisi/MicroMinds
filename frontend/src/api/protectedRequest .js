import { refreshAccessToken } from "./auth";

const protectedRequest = async (requestFn) => {
    try {
        return await requestFn();
    } catch (error) {
        if (error.response?.status === 401) {
            try {
                const response = await refreshAccessToken();
                console.log(response.data);
                localStorage.setItem("token", response.data.accessToken)
                return await requestFn()
            } catch (error) {
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                console.error("Session expired:", error);
                // optionally redirect to login instead of reload
                window.location.href = "/login";
            }
        }
        console.log(error);
        throw error
    }
}


export default protectedRequest