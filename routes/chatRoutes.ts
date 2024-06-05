import express from "express";
import {
  chatHistory,
  checkOrCreateChat,
  sendMessage,
} from "../controllers/chatController";

const router = express.Router();

router.get("/chat-history/:senderId/:receiverId", chatHistory);
router.post("/send-message", sendMessage);
router.get("/check-chat/:userId", checkOrCreateChat);

export default router;
