import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { getNotifications, markReadAll } from "../Controllers/notificationController.js";

const notificationRoute = express.Router();

notificationRoute.get("/", authMiddleware, getNotifications);
notificationRoute.put("/read", authMiddleware, markReadAll);

export default notificationRoute;
