import { User } from "../../models/user.js"
import { ApiError } from "../../utils/ApiError.js"
import { ApiResponse } from "../../utils/ApiResponse.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const loginController = {
    login: async (req, res) => {
        // req body -> data
        // username or email
        //find the user
        //password check
        //access and referesh token
        //send cookie  

        // validate the request
        const { username, email, password } = req.body
        console.log(req.body);

        if (!username && !email) {
            return res.status(400).json(new ApiError(400, [], "username/email is required"))
        }
        if (!password) {
            return res.status(400).json(new ApiError(400, [], "Password is required"))
        }

        // find user
        try {
            const user = await User.findOne({
                $or: [{ email }, { username }]
            })
            if (!user) throw new ApiError(404, "User does not exist")

            const isPasswordValid = await bcrypt.compare(password, user.password)
            if (!isPasswordValid) throw new ApiError(401, "Invalid user credentials")

            const accessToken = jwt.sign({ id: user._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: process.env.ACCESS_TOKEN_EXPIRY })
            const refreshToken = jwt.sign({ id: user._id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: process.env.REFRESH_TOKEN_EXPIRY })

            await User.findByIdAndUpdate(user._id, { refreshToken })

            const userResponse = await User.findById(user._id).select("-password -refreshToken")

            const options = {
                httpOnly: true,
                secure: true,
                sameSite: 'Strict',
                maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
            }


            return res
                .status(200)
                .cookie("accessToken", accessToken, options)
                .cookie("refreshToken", refreshToken, options)
                .json(new ApiResponse(200, { userResponse, refreshToken, accessToken }))

        } catch (error) {
            throw new ApiError(500, "Internal server error")
        }
    },

    async logout(req, res) {
        try {
            await User.findByIdAndUpdate(req.user._id, {
                $set: {
                    refreshToken: null
                }
            }, { new: true })
            const options = {
                httpOnly: true,
                secure: true,
                sameSite: 'Strict',
                maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
            }
            return res
                .status(200)
                .clearCookie("accessToken", options)
                .clearCookie("refreshToken", options)
                .json(new ApiResponse(200, {}, "Logged out Successfully"))

        } catch (error) {
            return res.status(500).json(new ApiError(500, "Internal Server problem"))
        }

    }
}

export default loginController