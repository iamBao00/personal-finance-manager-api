// services/notification-service.mjs
import Notification from "../database/models/notification-model.mjs";

class NotificationService {
  async listUnreadNotifications(req, res) {
    try {
      const userId = req.user._id;
      const unreadNotifications = await Notification.find({
        user_id: userId,
        read: false,
      });
      return res.status(200).json(unreadNotifications);
    } catch (error) {
      console.error(
        `Error from NotificationService.listUnreadNotifications: ${error}`
      );
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }

  async listAllNotifications(req, res) {
    try {
      const userId = req.user._id;
      const allNotifications = await Notification.find({ user_id: userId });
      return res.status(200).json(allNotifications);
    } catch (error) {
      console.error(
        `Error from NotificationService.listAllNotifications: ${error}`
      );
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }

  async markAsRead(req, res) {
    try {
      const { notificationId } = req.params;
      const userId = req.user._id;

      // Tìm và cập nhật thông báo thành đã đọc
      const notification = await Notification.findOneAndUpdate(
        { _id: notificationId, user_id: userId },
        { read: true },
        { new: true }
      );

      if (!notification) {
        return res.status(404).json({ message: "Notification not found" });
      }

      return res.status(200).json(notification);
    } catch (error) {
      console.error(`Error from NotificationService.markAsRead: ${error}`);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }
}

export default new NotificationService();
