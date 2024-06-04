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

const app = express();

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

app.listen(8080, () => {
  console.log("Server is running on port 8080");
});
