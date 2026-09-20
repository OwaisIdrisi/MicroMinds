import mongoose, { Schema } from "mongoose";

const conversationSchema = new Schema({
    participants: [{
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    }],
    lastMessage: {
        type: String,
        default: "",
    },
    lastMessageAt: {
        type: Date,
        default: null,
    },
}, { timestamps: true });

conversationSchema.index({ participants: 1 }, { unique: false });

export const Conversation = mongoose.model("Conversation", conversationSchema);
