import { refreshAccessToken } from "./auth";

const protectedRequest = async (requestFn) => {
    try {
        return await requestFn();
    } catch (error) {
        if (error.response?.status === 401) {
            try {
                await refreshAccessToken();
                return await requestFn()
            } catch (error) {
                console.log(error);
            }
        }
        console.log(error);
        throw error
    }
}


export default protectedRequest