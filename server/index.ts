import "dotenv/config";
import express from "express";
import cors from "cors";
import { Server, Socket } from "socket.io";
import { connectDB } from "./config/Config";
import { routerAuth } from "./routes/routes.user";
import errorMiddleware from "./middleware/Middleware.error";
import { routerMessage } from "./routes/routes.messages";
import { MapLike } from "typescript";

/**
 * @desc
 * handle uncought exception
 * run it before connecting to DB
 */
process.on("uncaughtException", (err) => {
  console.log("Shutting down server due uncaught exception.");
  console.log(`my uncaught Error: ${err.stack}`);

  process.exit(1);
});

/**
 * @desc
 * connect database
 */
connectDB();

/**
 * init app
 */
const app = express();

/**
 * apply middlewares
 */
app.use(
  cors({
    credentials: true,
    origin: ["http://localhost:3000", "http://localhost:3001"],
  })
);
//app.options("*", cors());

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

/**
 * connect routes
 */
app.use("/api/auth", routerAuth);
app.use("/api/messages", routerMessage);

/**
 * @desc
 * error middleware, always use it last
 */
app.use(errorMiddleware);

const server = app.listen(process.env.PORT, () => {
  console.log(`Server is running at port ${process.env.PORT || 5000}`);
});

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000", "http://localhost:3001"],
    credentials: true,
  },
});

export const onlineUsers = new Map();
export let chatSocket: Socket;

io.on("connection", (socket) => {
  chatSocket = socket;
  socket.on("add_user", (userId) => {
    onlineUsers.set(userId, socket.id);
  });

  socket.on("send_msg", (data) => {
    console.log("data msg: ", data);
    const sendUserSocket = onlineUsers.get(data.to);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("msg_recieve", data.message);
    }
  });
});

process.on("unhandledRejection", (err, promise) => {
  console.log("Logged error: ", err);
  server.close(() => process.exit(1));
});
