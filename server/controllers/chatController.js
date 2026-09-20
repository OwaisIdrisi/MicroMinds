import { Conversation } from "../models/conversation.js";
import { Message } from "../models/message.js";
import { User } from "../models/user.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { buildConversationKey } from "../utils/chat.js";

const chatController = {
    async listConversations(req, res) {
        try {
            const conversations = await Conversation.find({ participants: req.user._id })
                .populate("participants", "username fullName avatar")
                .sort({ updatedAt: -1 })
                .lean();

            return res.status(200).json(new ApiResponse(200, { conversations }, "Conversations fetched successfully"));
        } catch (error) {
            return res.status(500).json(new ApiError(500, error.message || "Internal server error"));
        }
    },

    async startConversation(req, res) {
        try {
            const { userId } = req.body;

            if (!userId) {
                return res.status(400).json(new ApiError(400, "User ID is required"));
            }

            if (String(userId) === String(req.user._id)) {
                return res.status(400).json(new ApiError(400, "You cannot chat with yourself"));
            }

            const otherUser = await User.findById(userId).select("_id username fullName avatar");
            if (!otherUser) {
                return res.status(404).json(new ApiError(404, "User not found"));
            }

            const existingConversation = await Conversation.findOne({
                participants: { $all: [req.user._id, otherUser._id], $size: 2 },
            }).populate("participants", "username fullName avatar");

            if (existingConversation) {
                return res.status(200).json(new ApiResponse(200, { conversation: existingConversation }, "Conversation already exists"));
            }

            const newConversation = await Conversation.create({
                participants: [req.user._id, otherUser._id],
                lastMessage: "",
                lastMessageAt: null,
            });

            const populatedConversation = await Conversation.findById(newConversation._id)
                .populate("participants", "username fullName avatar");

            return res.status(201).json(new ApiResponse(201, { conversation: populatedConversation }, "Conversation started successfully"));
        } catch (error) {
            return res.status(500).json(new ApiError(500, error.message || "Internal server error"));
        }
    },

    async getConversation(req, res) {
        try {
            const { conversationId } = req.params;

            const conversation = await Conversation.findOne({
                _id: conversationId,
                participants: req.user._id,
            }).populate("participants", "username fullName avatar");

            if (!conversation) {
                return res.status(404).json(new ApiError(404, "Conversation not found"));
            }

            const messages = await Message.find({ conversation: conversation._id })
                .populate("sender", "username fullName avatar")
                .sort({ createdAt: 1 });

            return res.status(200).json(new ApiResponse(200, { conversation, messages }, "Conversation fetched successfully"));
        } catch (error) {
            return res.status(500).json(new ApiError(500, error.message || "Internal server error"));
        }
    },

    async sendMessage(req, res) {
        try {
            const { conversationId } = req.params;
            const { text } = req.body;

            if (!text || !text.trim()) {
                return res.status(400).json(new ApiError(400, "Message text is required"));
            }

            const conversation = await Conversation.findOne({
                _id: conversationId,
                participants: req.user._id,
            });

            if (!conversation) {
                return res.status(404).json(new ApiError(404, "Conversation not found"));
            }

            const message = await Message.create({
                conversation: conversation._id,
                sender: req.user._id,
                text: text.trim(),
            });

            conversation.lastMessage = text.trim();
            conversation.lastMessageAt = new Date();
            await conversation.save();

            const populatedMessage = await Message.findById(message._id).populate("sender", "username fullName avatar");

            return res.status(201).json(new ApiResponse(201, { message: populatedMessage }, "Message sent successfully"));
        } catch (error) {
            return res.status(500).json(new ApiError(500, error.message || "Internal server error"));
        }
    },

    async getUserByUsername(req, res) {
        try {
            const { username } = req.params;
            const user = await User.findOne({ username }).select("_id username fullName avatar");

            if (!user) {
                return res.status(404).json(new ApiError(404, "User not found"));
            }

            return res.status(200).json(new ApiResponse(200, { user }, "User fetched successfully"));
        } catch (error) {
            return res.status(500).json(new ApiError(500, error.message || "Internal server error"));
        }
    },
};

export { chatController };
