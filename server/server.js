const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const dotenv = require("dotenv");
const { chats } = require("./data/data");
const connectDb = require("./config/connectDb");
const messageRoutes = require("./routes/messageRoutes");
const router = require("./routes/userRoute");
const { notFound, errorHandler } = require("./middlewares/errorMiddleware");
const chatRoutes = require("./routes/chatRoutes");
const NotificationRoutes =require("./routes/NotificationRoutes")
const http = require("http");
const Reactions = require("./models/ReactionModel");
const Message = require("./models/MessageModel");

// Configure dotenv
dotenv.config();

// Create an express app
const app = express();

// Use middleware
app.use(morgan("dev"));
app.disable("x-powered-by");
app.use(express.json());
app.use(cors());

// Define PORT
const PORT = process.env.PORT || 8080;

// Define routes
app.get("/", (req, res) => {
  res.status(201).json("Home GET Request");
});

// Use API routes
app.use("/api/user", router);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);
app.use("/api/notification", NotificationRoutes);
app.use(notFound);
app.use(errorHandler);

// Connect to the database
connectDb()
  .then(() => {
    // Create an HTTP server
    let server = http.createServer(app);

    // Listen to the PORT
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

    // Initialize Socket.IO
    const io = require("socket.io")(server, {
      pingTimeout: 60000,
      cors: {
        origin: "http://localhost:3000",
      },
    });

    // Socket.IO connection event
    io.on("connection", (socket) => {
      console.log("connected to socket-io");
      socket.on("setup", (userData) => {
        socket.userId = userData._id
        socket.join(userData._id);
        console.log(userData._id);
        socket.emit("connected");
      });
            
      socket.on("join chat", (room) => {
        socket.join(room);
        console.log("User Joined Room:" + room);
      });

      socket.on("typing", (room) => socket.in(room).emit("typing"));
      socket.on("stop typing", (room) => socket.in(room).emit(" stop typing"));
      socket.on("new message", (newMessageRecieved) => {
        var chat = newMessageRecieved.chat;
        if (!chat.users) return console.log("chat.users not defined");
        chat.users.forEach((user) => {
          if (user._id == newMessageRecieved.sender._id) return;
          socket.in(user._id).emit("message recieved", newMessageRecieved);
        });
      });
      // Inside the socket.on('delete message') listener
      socket.on("delete message", ({ messageId, chatId }) => {
        console.log(
          `Received delete message event for messageId: ${messageId}, chatId: ${chatId}`
        );
        // Find the chat and remove the message with the provided ID
        const chatIndex = chats.findIndex((chat) => chat._id === chatId);
        if (chatIndex !== -1) {
          const chat = chats[chatIndex];
          chat.messages = chat.messages.filter(
            (message) => message._id !== messageId
          );
          // Emit an event to inform clients that the message was deleted
          io.to(chatId).emit("message deleted", messageId);
        }
      });
      
      //socket on clearChat
      socket.on("clear chat", async (chatId) => {
        try {
            // Implement logic to clear the chat for the provided chatId
            // For example, you can delete all messages associated with the chatId
            // Once the chat is cleared, emit an event to inform clients
            // Emitting to all clients in the chat room
            // This example assumes you have a method to clear chat on your database
            await clearChatInDatabase(chatId);
            io.to(chatId).emit("chat cleared");
        } catch (error) {
            console.error("Error clearing chat:", error);
        }
    });

      // Socket.IO event for reacting to a message
      socket.on("add reaction", async (data,chatId) => {
        const { messageId, reactionType } = data;
        const {userId} = socket;
        const reaction = await Reactions.create({
          userId,
          messageId,
          reactionType,
        });
        const message = await Message.findByIdAndUpdate(
          messageId,
          { $push: { reactions: reaction._id } },
          { new: true }
        ).populate("reactions");
        socket.to(chatId).emit("message updated", message);
      });

      socket.off("setup", () => {
        console.log("USER DISCONNECTED");
        socket.leave(userData._id);
      });
    });
  })
  .catch((error) => {
    console.log("Invalid database connection...!");
  });