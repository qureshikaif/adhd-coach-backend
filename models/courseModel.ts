import pool from "../db";
import express from "express";
import { CourseType } from "../types/CourseType";

export const createCourse = async (course: CourseType) => {
  const { title, description, instructor } = course;
  const result = await pool.query(
    "INSERT INTO courses (title, description, instructor) VALUES ($1, $2, $3) RETURNING *",
    [title, description, instructor]
  );
  return result.rows[0];
};

export const getCourseById = async (id: string) => {
  const result = await pool.query("SELECT * FROM courses WHERE id = $1", [id]);
  return result.rows[0];
};

export const getAllCourses = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const result = await pool.query("SELECT * FROM courses");
    return res.status(200).json(result.rows);
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
};

export const findCourseByTitle = async (title: string) => {
  const result = await pool.query("SELECT * FROM courses WHERE title = $1", [
    title,
  ]);
  return result.rows[0];
};
