import express from "express";
import cors from "cors";
import { Server } from "socket.io";
import http from "http";
import pool from "./db.ts";
import authRoutes from "./routes/authRoutes.ts";
import adminRoutes from "./routes/adminRoutes.ts";
import parentRoutes from "./routes/parentRoutes.ts";
import teacherRoutes from "./routes/teacherRoutes.ts";
import doctorRoutes from "./routes/doctorRoutes.ts";
import studentRoutes from "./routes/studentRoutes.ts";

const app = express();
const server = http.createServer(app);

// const io = new Server(server, {
//   cors: {
//     origin: "*",
//   },
// });

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

// io.on("connection", (socket) => {
//   console.log("a user connected", socket.id);

//   socket.on("send message", (msg) => {
//     console.log("message: " + msg);
//     socket.broadcast.emit("recieve message", msg);
//   });

//   socket.on("disconnect", () => {
//     console.log("user disconnected");
//   });
// });

server.listen(8080, () => {
  console.log("Server is running on port 8080");
});
