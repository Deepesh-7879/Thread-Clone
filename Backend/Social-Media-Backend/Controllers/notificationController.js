import Notification from "../Models/notificationModel.js";

// Get all notifications for the current user
export const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ receiverId: req.userId })
      .populate("senderId", "username displayName profilePicture")
      .populate("postId", "content") // optional if it's a post related notification
      .sort({ createdAt: -1 })
      .limit(50); // Limit to last 50 for performance

    res.status(200).json(notifications);
  } catch (error) {
    console.error("Error in getNotifications:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// Mark a specific notification as read or all notifications as read
export const markReadAll = async (req, res) => {
  try {
    // We can just mark all unread notifications for this user as read
    await Notification.updateMany(
      { receiverId: req.userId, read: false },
      { $set: { read: true } }
    );

    res.status(200).json({ message: "Notifications marked as read" });
  } catch (error) {
    console.error("Error in markReadAll:", error);
    res.status(500).json({ error: "Server error" });
  }
};
