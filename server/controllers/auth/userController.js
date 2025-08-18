import { User } from "../../models/user.js"
import { ApiError } from "../../utils/ApiError.js"
import { ApiResponse } from "../../utils/ApiResponse.js"
import { Blog } from "../../models/blog.js"
import jwt from 'jsonwebtoken'

const options = {
    httpOnly: true,
    secure: true,
}
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
        const incomingRefreshToken = req.cookies?.refreshToken || req.body.refreshToken
        if (!incomingRefreshToken) {
            return res.status(401).json(new ApiError(401, "Unathorized request"))
        }
        try {
            const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET)
            const user = await User.findById(decodedToken.id)
            if (!user) {
                return res.status(401).json(new ApiError(401, "Invalid refresh token"))
            }
            if (incomingRefreshToken !== user?.refreshToken) {
                return res.status(401).clearCookie("accessToken", options).clearCookie("refreshToken", options)
                    .json(new ApiError(401, " refresh token is expired or used"))
            }

            const accessToken = jwt.sign({ id: user._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: process.env.ACCESS_TOKEN_EXPIRY })
            const refreshToken = jwt.sign({ id: user._id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: process.env.REFRESH_TOKEN_EXPIRY })
            user.refreshToken = refreshToken
            await user.save()

            return res
                .status(200)
                .cookie("accessToken", accessToken, options)
                .cookie("refreshToken", refreshToken, options)
                .json(new ApiResponse(200, { refreshToken, accessToken }, "Access token refreshed"))
        } catch (error) {
            res.status(401).json(new ApiError(401, error?.message || "Invalid refresh token"))
        }
    },
    async myProfile(req, res) {
        console.log(req.params);

        try {
            const { username } = req.params
            // find user by username
            const user = await User.findOne({ username }).select("-password -refreshToken")
            if (!user) {
                return res.status(404).json(new ApiError(404, "User Not Found"))
            }
            console.log(user);

            // find blogs created by that user
            const blogs = await Blog.find({ creatorUsername: user.username }).populate("creator", "username avatar").sort({ createdAt: -1 }).lean()
            console.log(blogs);


            return res.status(200).json(new ApiResponse(200, { user, blogs }))
        } catch (error) {
            return res.status(500).json(new ApiError(500, error.message))
        }
    }
}

export default userController