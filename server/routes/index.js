import express from "express";
import registerController from "../controllers/auth/registerController.js";
import loginController from "../controllers/auth/loginController.js";
import userController from "../controllers/auth/userController.js";
import { upload } from "../middlewares/multer.middleware.js";
import { authenticateUser } from "../middlewares/auth.middleware.js";
import { blogController } from "../controllers/blogController.js";
import { chatController } from "../controllers/chatController.js";
import { commentController } from "../controllers/commentController.js";
const router = express.Router()

// Auth routes
router.post("/register",
    upload.single("avatar")
    , registerController.register)

router.post("/login", loginController.login)
router.post("/logout", authenticateUser, loginController.logout)
router.post("/refresh-token", userController.refreshAccessToken)
router.get("/me", authenticateUser, userController.me)
router.get("/profile/:username", authenticateUser, userController.myProfile)

// blog routes
router.post("/blog", authenticateUser,
    upload.single("cover")
    , blogController.addBlog)
router.get("/blog", authenticateUser, blogController.getBlogs)
router.get("/blog/my", authenticateUser, blogController.getMyBlogs)
router.get("/blog/:id", authenticateUser, blogController.getBlog)
router.patch("/blog/:id", authenticateUser, blogController.updateBlog)
router.patch("/blog/cover-image/:id", authenticateUser, upload.single("cover"), blogController.updateCover)
router.delete("/blog/:id", authenticateUser, blogController.deleteBlog)

router.post("/blog/like/:id", authenticateUser, blogController.likeBlog)
router.get("/blog/tag/:id", authenticateUser, blogController.getBlogsByTag)
router.get("/blog/:blogId/comments", authenticateUser, commentController.getComments)
router.post("/blog/:blogId/comments", authenticateUser, commentController.addComment)
router.delete("/blog/:blogId/comments/:commentId", authenticateUser, commentController.deleteComment)

router.get("/chat/conversations", authenticateUser, chatController.listConversations)
router.post("/chat/start", authenticateUser, chatController.startConversation)
router.get("/chat/:conversationId", authenticateUser, chatController.getConversation)
router.post("/chat/:conversationId/message", authenticateUser, chatController.sendMessage)
router.get("/users/:username", authenticateUser, chatController.getUserByUsername)


export default router