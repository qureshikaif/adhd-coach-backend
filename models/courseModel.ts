import pool from "../db";
import { CourseType } from "../types/CourseType";

export const createCourse = async (course: CourseType) => {
  const { name, description, instructor } = course;
  const result = await pool.query(
    "INSERT INTO courses (name, description, instructor) VALUES ($1, $2, $3) RETURNING *",
    [name, description, instructor]
  );
  return result.rows[0];
};

export const getCourseById = async (id: string) => {
  const result = await pool.query("SELECT * FROM courses WHERE id = $1", [id]);
  return result.rows[0];
};

export const getAllCourses = async () => {
  const result = await pool.query("SELECT * FROM courses");
  return result.rows;
};
