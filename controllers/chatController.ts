import pool from "../db";
import express from "express";
import { io } from "../server";

export const chatHistory = async (
  req: express.Request,
  res: express.Response
) => {
  const { senderId, receiverId } = req.params;
  try {
    const result = await pool.query(
      `SELECT * FROM chats
       WHERE (sender_id = $1 AND receiver_id = $2) 
          OR (sender_id = $2 AND receiver_id = $1)
       ORDER BY timestamp`,
      [senderId, receiverId]
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching chat history", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const sendMessage = async (
  req: express.Request,
  res: express.Response
) => {
  const { sender_id, receiver_id, message } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO chats (sender_id, receiver_id, message) VALUES ($1, $2, $3) RETURNING *",
      [sender_id, receiver_id, message]
    );
    const chatMessage = result.rows[0];
    io.emit("receiveMessage", chatMessage);
    res.status(201).json(chatMessage);
  } catch (error) {
    console.error("Error sending message", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
