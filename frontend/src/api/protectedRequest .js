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
                localStorage.removeItem("token")
                localStorage.removeItem("user")
                // window.location.reload() 
                console.log(error);
            }
        }
        console.log(error);
        throw error
    }
}


export default protectedRequest