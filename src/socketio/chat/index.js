import { Chat } from "../../db/model/chat.model.js";
import { User } from "../../db/model/user.model.js";

export const sendMessage = (socket, io) => {
  return async (data) => {
    const { senderId, receiverId, message } = data;

    // Emit message to receiver
    socket
      .to(receiverId)
      .emit("receiveMessage", { senderId, message });

    let chat = await Chat.findOne({
      $or: [
        { senderId, receiverId },
        { senderId: receiverId, receiverId: senderId },
      ],
    });

    if (!chat) {
      // Only HR or Company Owner can start a conversation
      const sender = await User.findById(senderId);
      if (
        !sender ||
        !["hr", "companyOwner"].includes(sender.role)
      ) {
        return socket.emit("error", {
          message:
            "Only HR or company owners can start a chat",
        });
      }

      chat = new Chat({
        senderId,
        receiverId,
        messages: [],
      });
    }

    // Save message in chat history
    chat.messages.push({ senderId, message });
    await chat.save();

    // Emit message to the chat room
    const room = [senderId, receiverId].sort().join("_");
    io.to(room).emit("receiveMessage", {
      senderId,
      message,
    });
  };
};

export const joinChat = (socket, io) => {
  return ({ senderId, receiverId }) => {
    const room = [senderId, receiverId].sort().join("_");
    socket.join(room);
    console.log(
      `User ${senderId} joined chat with ${receiverId}`
    );
  };
};
