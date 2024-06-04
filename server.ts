import { Server } from "socket.io";
import express from "express";
import cors from "cors";
import http from "http";
import pool from "./db";
import authRoutes from "./routes/authRoutes";
import adminRoutes from "./routes/adminRoutes";
import parentRoutes from "./routes/parentRoutes";
import teacherRoutes from "./routes/teacherRoutes";
import doctorRoutes from "./routes/doctorRoutes";
import studentRoutes from "./routes/studentRoutes";
import chatRoutes from "./routes/chatRoutes";

const app = express();
const server = http.createServer(app);
export const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

app.use(cors());
app.use(express.json());

app.get("/", (req: express.Request, res: express.Response) => {
  res.json({ message: "Hello World", pool });
});

app.use("/auth", authRoutes);
app.use("/admin", adminRoutes);
app.use("/parent", parentRoutes);
app.use("/teacher", teacherRoutes);
app.use("/doctor", doctorRoutes);
app.use("/student", studentRoutes);
app.use("/chat", chatRoutes);

io.on("connection", (socket) => {
  console.log("A user connected", socket.id);

  socket.on("sendMessage", async (data) => {
    const { sender_id, receiver_id, message } = data;
    try {
      const result = await pool.query(
        "INSERT INTO chats (sender_id, receiver_id, message) VALUES ($1, $2, $3) RETURNING *",
        [sender_id, receiver_id, message]
      );
      const chatMessage = result.rows[0];
      io.emit("receiveMessage", chatMessage);
    } catch (error) {
      console.error("Error sending message", error);
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected", socket.id);
  });
});

server.listen(8080, () => {
  console.log("Server is running on port 8080");
});
