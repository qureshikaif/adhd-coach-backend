import pool from "../db";

export const createReview = async (review: any) => {
  const { courseId, userId, rating, comment } = review;
  const result = await pool.query(
    "INSERT INTO reviews (course_id, user_id, rating, comment) VALUES ($1, $2, $3, $4) RETURNING *",
    [courseId, userId, rating, comment]
  );
  return result.rows[0];
};

export const getReviewsByCourseId = async (courseId: any) => {
  const result = await pool.query(
    "SELECT * FROM reviews WHERE course_id = $1",
    [courseId]
  );
  return result.rows;
};
