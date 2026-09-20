import { Blog } from "../models/blog.js";
import { Comment } from "../models/comment.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const commentController = {
    async getComments(req, res) {
        try {
            const { blogId } = req.params;

            const blog = await Blog.findById(blogId);
            if (!blog) {
                return res.status(404).json(new ApiError(404, "Blog not found"));
            }

            const comments = await Comment.find({ blog: blogId })
                .populate("author", "username fullName avatar")
                .sort({ createdAt: 1 });

            return res.status(200).json(new ApiResponse(200, { comments }, "Comments fetched successfully"));
        } catch (error) {
            return res.status(500).json(new ApiError(500, error.message || "Internal server error"));
        }
    },

    async addComment(req, res) {
        try {
            const { blogId } = req.params;
            const { text } = req.body;

            if (!text || !text.trim()) {
                return res.status(400).json(new ApiError(400, "Comment text is required"));
            }

            const blog = await Blog.findById(blogId);
            if (!blog) {
                return res.status(404).json(new ApiError(404, "Blog not found"));
            }

            const comment = await Comment.create({
                blog: blogId,
                author: req.user._id,
                text: text.trim(),
            });

            const populatedComment = await Comment.findById(comment._id).populate("author", "username fullName avatar");

            return res.status(201).json(new ApiResponse(201, { comment: populatedComment }, "Comment added successfully"));
        } catch (error) {
            return res.status(500).json(new ApiError(500, error.message || "Internal server error"));
        }
    },

    async deleteComment(req, res) {
        try {
            const { blogId, commentId } = req.params;

            const blog = await Blog.findById(blogId);
            if (!blog) {
                return res.status(404).json(new ApiError(404, "Blog not found"));
            }

            const comment = await Comment.findById(commentId);
            if (!comment) {
                return res.status(404).json(new ApiError(404, "Comment not found"));
            }

            if (!comment.author.equals(req.user._id)) {
                return res.status(403).json(new ApiError(403, "You can only delete your own comment"));
            }

            await Comment.findByIdAndDelete(commentId);

            return res.status(200).json(new ApiResponse(200, null, "Comment deleted successfully"));
        } catch (error) {
            return res.status(500).json(new ApiError(500, error.message || "Internal server error"));
        }
    },
};

export { commentController };
