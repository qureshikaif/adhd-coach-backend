import pool from "../db.ts";

export const createAssessment = async (assessment: any) => {
  const { studentId, score } = assessment;
  const result = await pool.query(
    "INSERT INTO assessments (student_id, score) VALUES ($1, $2) RETURNING *",
    [studentId, score]
  );
  return result.rows[0];
};

export const getAssessmentsByStudentId = async (studentId: any) => {
  const result = await pool.query(
    "SELECT * FROM assessments WHERE student_id = $1",
    [studentId]
  );
  return result.rows;
};
