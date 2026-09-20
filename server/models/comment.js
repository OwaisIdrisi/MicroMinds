import mongoose, { Schema } from "mongoose";

const commentSchema = new Schema({
    blog: {
        type: Schema.Types.ObjectId,
        ref: "Blog",
        required: true,
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    text: {
        type: String,
        required: true,
        trim: true,
    },
}, { timestamps: true });

export const Comment = mongoose.model("Comment", commentSchema);
