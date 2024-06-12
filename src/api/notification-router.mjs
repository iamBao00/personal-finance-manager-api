// routes/notification-routes.mjs
import express from "express";
import NotificationService from "../services/notification-service.mjs";
import authenticateToken from "./middleware/auth.mjs";

const router = express.Router();

// API để lấy danh sách các Notification chưa đọc của người dùng
router.get(
  "/unread",
  authenticateToken,
  NotificationService.listUnreadNotifications
);

// API để lấy tất cả các Notification của người dùng
router.get("/all", authenticateToken, NotificationService.listAllNotifications);

export default router;
