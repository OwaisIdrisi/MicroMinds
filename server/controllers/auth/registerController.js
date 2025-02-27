import { User } from "../../models/user.js"
import { ApiError } from "../../utils/ApiError.js"
import { ApiResponse } from "../../utils/ApiResponse.js"
import { uploadOnCloudinary } from "../../utils/cloudinary.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const registerController = {
    register: async (req, res) => {
        // CHECKLIST
        // get user details from frontend
        // validation - not empty
        // check if user already exists: username, email
        // check for images, check for avatar
        // upload them to cloudinary, avatar
        // create user object - create entry in db
        // remove password and refresh token field from response
        // check for user creation
        // return res

        const { fullName, username, email, password } = req.body

        if (
            [fullName, username, email, password].some(field => field.trim() === "")
        ) {
            throw new ApiError(400, "All fields are required")
        }

        const existedUser = await User.findOne({
            $or: [{ username }, { email }]
        })
        if (existedUser) {
            throw new ApiError(409, "User with this email or username is already exists")
        }

        const avatarLocalPath = req.file?.path
        if (!avatarLocalPath) {
            throw new ApiError(400, "Avatar File is required")
        }
        const avatar = await uploadOnCloudinary(avatarLocalPath)

        const hashedPassword = await bcrypt.hash(password, 10)

        const user = new User({ fullName, username, email, password: hashedPassword, avatar })
        try {
            const newUser = await user.save()
            console.log("New User", newUser)

            const accessToken = jwt.sign({ id: newUser._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: process.env.ACCESS_TOKEN_EXPIRY })
            const refreshToken = jwt.sign({ id: newUser._id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: process.env.REFRESH_TOKEN_EXPIRY })

            await User.findByIdAndUpdate(newUser._id, { refreshToken });


            const createdUser = await User.findById(newUser._id).select("-password -refreshToken")


            const options = {
                httpOnly: true,
                secure: true
            }
            return res
                .status(201)
                .cookie("accessToken", accessToken, options)
                .cookie("refreshToken", refreshToken, options)
                .json(
                    new ApiResponse(201, { accessToken, refreshToken, createdUser }, "User Created Successfully")
                )
        } catch (error) {
            console.log(error)
            throw new ApiError(500, "Something went wrong while registering user")
        }
    }
}

export default registerController