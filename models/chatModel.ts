import pool from "../db.ts";

export const createChatMessage = async (chat: any) => {
  const { senderId, receiverId, message } = chat;
  const result = await pool.query(
    "INSERT INTO chats (sender_id, receiver_id, message) VALUES ($1, $2, $3) RETURNING *",
    [senderId, receiverId, message]
  );
  return result.rows[0];
};

export const getChatMessages = async (userId1: any, userId2: any) => {
  const result = await pool.query(
    "SELECT * FROM chats WHERE (sender_id = $1 AND receiver_id = $2) OR (sender_id = $2 AND receiver_id = $1) ORDER BY timestamp",
    [userId1, userId2]
  );
  return result.rows;
};
