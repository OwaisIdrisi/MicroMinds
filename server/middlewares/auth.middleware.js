import jwt from "jsonwebtoken"
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.js";

const authenticateUser = async (req, res, next) => {
    try {
        const token = req.cookie?.accessToken || req.header("Authorization").split(" ")[1]
        if (!token) throw new ApiError(401, "Unathorized request")

        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

        const user = await User.findById(decodedToken.id).select("-password -refreshToken")
        if (!user) throw new ApiError(401, "Invalid access token")

        req.user = user
        next()
    } catch (error) {
        return res.status(401).json(new ApiResponse(401, [], "Unathorized request"))
    }
}

export { authenticateUser }