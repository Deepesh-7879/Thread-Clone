import Notification from "../Models/notificationModel.js";
import Message from "../Models/messageModel.js";

// Get all conversations for the logged in user
export const getConversations = async (req, res) => {
  try {
    const userId = req.userId;

    // Find all messages involving the user
    const messages = await Message.find({
      $or: [{ senderId: userId }, { receiverId: userId }]
    }).sort({ createdAt: 1 }); // oldest to newest

    const convosMap = new Map();

    messages.forEach(m => {
      const otherUserId = m.senderId.toString() === userId ? m.receiverId.toString() : m.senderId.toString();
      
      if (!convosMap.has(otherUserId)) {
        convosMap.set(otherUserId, { id: otherUserId, with: otherUserId, messages: [] });
      }
      
      convosMap.get(otherUserId).messages.push({
        id: m._id.toString(),
        senderId: m.senderId.toString(),
        text: m.text,
        ts: m.createdAt,
        read: m.read
      });
    });

    res.status(200).json(Array.from(convosMap.values()));
  } catch (error) {
    console.error("Error in getConversations:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// Send a new message
export const sendMessage = async (req, res) => {
  try {
    const { receiverId, text } = req.body;
    const senderId = req.userId;

    if (!receiverId || !text) {
      return res.status(400).json({ error: "Receiver ID and text are required" });
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      read: false
    });

    await newMessage.save();

    // Create notification
    await Notification.create({
      receiverId,
      senderId,
      type: 'message',
      text: text.substring(0, 50)
    });

    res.status(201).json({
      id: newMessage._id.toString(),
      senderId: newMessage.senderId.toString(),
      text: newMessage.text,
      ts: newMessage.createdAt,
      read: newMessage.read,
      with: receiverId // Return 'with' so the frontend knows which conversation this belongs to
    });
  } catch (error) {
    console.error("Error in sendMessage:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// Mark a conversation's messages as read
export const markRead = async (req, res) => {
  try {
    const { otherUserId } = req.params;
    const userId = req.userId;

    await Message.updateMany(
      { senderId: otherUserId, receiverId: userId, read: false },
      { $set: { read: true } }
    );

    res.status(200).json({ message: "Messages marked as read" });
  } catch (error) {
    console.error("Error in markRead:", error);
    res.status(500).json({ error: "Server error" });
  }
};
