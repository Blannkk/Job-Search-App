import { Server } from "socket.io";
import { authSocket } from "./middleware/auth.socket.js";
import { joinChat, sendMessage } from "./chat/index.js";

export let io;

export const initSocket = (server) => {
  const io = new Server(server, {
    cors: { origin: "*" },
  });

  io.use(authSocket);

  io.on("connection", (socket) => {
    console.log(`Client connected: ${socket.id}`);

    socket.on("sendMessage", sendMessage(socket, io));
    socket.on("joinChat", joinChat(socket, io));
  });
};
