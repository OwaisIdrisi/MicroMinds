import { User } from "../../models/user.js"
import { ApiError } from "../../utils/ApiError.js"
import { ApiResponse } from "../../utils/ApiResponse.js"
import jwt from 'jsonwebtoken'

const userController = {
    async me(req, res) {
        try {
            const user = await User.findOne({ _id: req.user._id }).select("-password -refreshToken")
            if (!user) throw new ApiError(404, "User Not Found")
            return res.status(200).json(new ApiResponse(200, { user }))
        } catch (error) {
            throw new ApiError(500, "Internal server error")
        }
    },
    async refreshAccessToken(req, res) {
        const incomingRefreshToken = req.cookie?.refreshToken || req.body.refreshToken
        if (!incomingRefreshToken) throw new ApiError(401, "Unathorized request")
        try {
            const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET)
            const user = await User.findById(decodedToken.id)
            if (!user) new ApiError(401, "Invalid refresh token")

            if (incomingRefreshToken !== user?.refreshToken) new ApiError(401, " refresh token is expired or used")

            const accessToken = jwt.sign({ id: user._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: process.env.ACCESS_TOKEN_EXPIRY })
            const refreshToken = jwt.sign({ id: user._id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: process.env.REFRESH_TOKEN_EXPIRY })
            const options = {
                httpOnly: true,
                secure: true
            }
            return res
                .status(200)
                .cookie("accessToken", accessToken, options)
                .cookie("refreshToken", refreshToken, options)
                .json(new ApiResponse(200, { refreshToken, accessToken }, "Access token refreshed"))
        } catch (error) {
            throw new ApiError(401, error?.message || "Invalid refresh token")
        }
    }
}

export default userController