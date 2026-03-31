import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { getConversations, sendMessage, markRead } from "../Controllers/messageController.js";

const messageRoute = express.Router();

messageRoute.get("/conversations", authMiddleware, getConversations);
messageRoute.post("/", authMiddleware, sendMessage);
messageRoute.put("/:otherUserId/read", authMiddleware, markRead);

export default messageRoute;
