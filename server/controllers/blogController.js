import { Blog } from "../models/blog.js"
import { User } from "../models/user.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { uploadOnCloudinary, getPublicIdFromUrl, destoyImage } from "../utils/cloudinary.js"

const blogController = {
    async addBlog(req, res) {
        const { title, content, tags } = req.body
        if (title?.trim() === "" || content?.trim() === "") {
            return res.status(400).json(new ApiError(400, "Title and content cannot be empty"));
        }
        const formattedTags = tags ? tags.map(tag => tag.trim().toLowerCase()) : []

        let coverLocalPath = req.file?.path
        if (!coverLocalPath) {
            return res.status(400).json(new ApiError(400, "Cover image is required"));
        }

        const cover = await uploadOnCloudinary(coverLocalPath)
        const creator = await User.findById(req.user._id)
        if (!creator) {
            return res.status(404).json(new ApiError(404, "Creator not found"));
        }

        const blog = new Blog({ title, content, creator: creator._id, creatorUsername: creator.username, cover, likes: [], formattedTags })
        try {
            const newBlog = await blog.save()
            return res.status(201).json(new ApiResponse(201, { newBlog, }, "Blog Created Successfully"))
        } catch (error) {
            return res.status(500).json(new ApiError(500, error.message || "Internal server error"))
        }
    },

    async getBlogs(req, res) {
        try {
            const blogs = await Blog.find().select("-__v")
            const myBlogs = blogs.filter(blog => blog.creatorUsername == req.user.username)

            return res.status(200).json(new ApiResponse(200, { blogs, myBlogs }, blogs.length ? "Success" : "No blogs found"));
        } catch (error) {
            return res.status(500).json(new ApiError(500, error.message || "Internal server error"))
        }
    },

    async getBlog(req, res) {
        const { id } = req.params
        try {
            const blog = await Blog.findById(id).select("-__v")
            if (!blog) return res.status(404).json(new ApiError(404, "blog doesn't exists"))
            return res.status(200).json(new ApiResponse(200, blog, "success"))
        } catch (error) {
            return res.status(500).json(new ApiError(500, error.message || "internal server error"))
        }
    },

    async updateBlog(req, res) {
        const { id } = req.params
        const { title, content } = req.body
        if (title?.trim() === "" || content?.trim() === "") {
            return res.status(401).json(new ApiError(401, "title/content cannot be empty"))
        }
        try {
            let blog = await Blog.findById(id)
            if (!blog) return res.status(404).json(new ApiError(404, "Blog not found"));

            if (!blog.creator.equals(req.user._id)) {
                return res.status(403).json(new ApiError(403, "Only creator can edit the blog"))
            }
            blog = await Blog.findByIdAndUpdate(id, {
                $set: { title, content }
            }, { new: true }).select("-_id -__v")
            return res.status(200).json(new ApiResponse(200, blog, "updated successfully"))
        } catch (error) {
            return res.status(500).json(new ApiResponse(500, { error: error.message || "Internal server error" }, "Error while updating blog "))
        }
    },

    async deleteBlog(req, res) {
        const { id } = req.params
        try {
            let blog = await Blog.findById(id)
            if (!blog) {
                return res.status(404).json(new ApiError(404, "Blog not found"))
            }
            if (!blog.creator.equals(req.user._id)) {
                return res.status(401).json(new ApiError(401, [], "Only creator can edit the blog"))
            }
            const deletedBlog = await Blog.findByIdAndDelete(id)
            console.log(deletedBlog);
            const publicId = getPublicIdFromUrl(deletedBlog?.cover)
            const response = await destoyImage(publicId)
            console.log("response", response);




            return res.status(200).json(new ApiResponse(200, null, "blog deleted successfully"))
        } catch (error) {
            return res.status(500).json(new ApiResponse(500, { error: error?.message }, "Internal server error"))
        }
    },

    async updateCover(req, res) {
        const { id } = req.params
        const coverLocalPath = req.file?.path
        if (!coverLocalPath) {
            return res.status(400).json(new ApiError(400, [], "CoverImage File is required"))
        }
        try {
            const blog = await Blog.findById(id)
            if (!blog) {
                return res.status(404).json(new ApiError(404, [], "blog not found"))
            }
            //  delete the existing coverImage
            const publicId = getPublicIdFromUrl(blog.cover)
            await destoyImage(publicId)

            //  upload new coverImage
            // update blog document in database
            const newCover = await uploadOnCloudinary(coverLocalPath)
            const updatedBlog = await Blog.findByIdAndUpdate(blog._id, {
                $set: { cover: newCover }
            }, { new: true })

            return res.status(200).json(new ApiResponse(200, updatedBlog, "updated cover Image successfully"))
        } catch (error) {
            return res.status(500).json(new ApiResponse(500, { error: error.message || "Internal server error" }, "Error while updating cover Image "))
        }
    },
    async likeBlog(req, res) {
        try {
            // Check if the user has already liked the blog.
            // If they have, remove their like.
            //  If they haven’t, add their like.
            //  Return the updated blog.
            const { id } = req.params
            if (!id) {
                return res.status(400).json(new ApiError(400, "id is required"))
            }

            const blog = await Blog.findById(id)
            if (!blog) {
                return res.status(404).json(new ApiError(404, "blog is not found"))
            }

            if (blog.likes.includes(req.user._id)) {
                const updatedBlog = await Blog.findByIdAndUpdate(blog._id, {
                    $pull: { likes: req.user._id }
                }, { new: true })
                return res.status(200).json(new ApiResponse(200, updatedBlog, "unliked successfully"))
            } else {
                const updatedBlog = await Blog.findByIdAndUpdate(blog._id, {
                    $push: {
                        likes: req.user._id
                    }
                }, { new: true })
                return res.status(200).json(new ApiResponse(200, updatedBlog, "Liked successfully"))
            }
        } catch (error) {
            console.log(error);
            return res.status(500).json(new ApiError(500, error.message || "Internal server error"))
        }
    },
    async getBlogsByTag(req, res) {
        try {
            const tag = req.params.tag.toLowerCase()
            const blogs = await Blog.find({ tags: { $in: [new RegExp(`^${tag}$`, "i")] } });
            return res.status(200).json(new ApiResponse(200, blogs, blogs.length ? "Success" : "No blogs found"));
        } catch (error) {
            return res.status(500).json(new ApiError(500, error.message || "Internal server error"))
        }
    }
}


export { blogController }