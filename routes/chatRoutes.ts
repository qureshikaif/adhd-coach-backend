import express from "express";
import { chatHistory, sendMessage } from "../controllers/chatController";

const router = express.Router();

router.get("/chat-history/:senderId/:receiverId", chatHistory);
router.post("/send-message", sendMessage);

export default router;
