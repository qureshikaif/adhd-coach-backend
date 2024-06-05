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

export const checkOrCreateChat = async (
  req: express.Request,
  res: express.Response
) => {
  const { userId } = req.params;
  try {
    const result = await pool.query(
      `SELECT * FROM chats
         WHERE sender_id = $1 OR receiver_id = $1
         ORDER BY timestamp`,
      [userId]
    );

    if (result.rows.length > 0) {
      res.json({ chats: result.rows });
    } else {
      res.json({ message: "No existing chats. Create a new chat." });
    }
  } catch (error) {
    console.error("Error checking or creating chat", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getUsers = async (req: express.Request, res: express.Response) => {
  try {
    const doctorQuery = pool.query(
      "SELECT id, full_name, email, id_assigned, specialization, 'doctor' AS type FROM doctors"
    );
    const teacherQuery = pool.query(
      "SELECT id, full_name, email, id_assigned, NULL AS specialization, 'teacher' AS type FROM teachers"
    );

    const [doctorResults, teacherResults] = await Promise.all([
      doctorQuery,
      teacherQuery,
    ]);

    const combinedList = [...doctorResults.rows, ...teacherResults.rows];

    res.status(200).json(combinedList);
  } catch (error) {
    console.error("Error fetching combined list:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
