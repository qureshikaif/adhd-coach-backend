import pool from "../db";
import express from 'express';

export const createFeedback = async (table: string, feedback: string, userId: string) => {
  const query = `INSERT INTO ${table} (feedback, user_id) VALUES ($1, $2) RETURNING *`;
  const values = [feedback, userId];
  const result = await pool.query(query, values);
  return result.rows[0];
};

export const getFeedbackByUserId = async (table: string, userId: string) => {
  const query = `SELECT * FROM ${table} WHERE user_id = $1`;
  const result = await pool.query(query, [userId]);
  return result.rows;
};


export const getAllFeedbacks = async (req: express.Request, res: express.Response) => {
  const query = `
    SELECT
      f.id AS feedback_id,
      f.feedback,
      'doctor' AS role,
      d.full_name AS user_name
    FROM doctor_feedbacks f
    JOIN doctors d ON f.user_id = d.id
    UNION ALL
    SELECT
      f.id AS feedback_id,
      f.feedback,
      'teacher' AS role,
      t.full_name AS user_name
    FROM teacher_feedbacks f
    JOIN teachers t ON f.user_id = t.id
    UNION ALL
    SELECT
      f.id AS feedback_id,
      f.feedback,
      'parent' AS role,
      p.full_name AS user_name
    FROM parent_feedbacks f
    JOIN parents p ON f.user_id = p.id;
  `;

  try {
    const result = await pool.query(query);
    res.status(200).json(result.rows);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
