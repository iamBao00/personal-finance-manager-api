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
}

export default new NotificationService();
