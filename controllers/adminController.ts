import { createCourse, getCourseById } from "../models/courseModel";
import { createArticle } from "../models/articleModel";
import { getReviewsByCourseId } from "../models/reviewModel";
import { createChatMessage } from "../models/chatModel";
import pool from "../db";
import express from "express";

export const addCourse = async (
  req: express.Request,
  res: express.Response
) => {
  const { name, description, instructor } = req.body;
  try {
    const course = await createCourse({ name, description, instructor });
    res.status(201).json(course);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const addArticle = async (
  req: express.Request,
  res: express.Response
) => {
  const { title, subtitle, tags, content, summary } = req.body;
  try {
    const article = await createArticle({
      title,
      subtitle,
      tags,
      content,
      summary,
    });
    res.status(201).json(article);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const addDoctor = async (
  req: express.Request,
  res: express.Response
) => {
  const { doctorId } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO doctors (id_assigned) VALUES ($1) RETURNING *",
      [doctorId]
    );
    return res
      .status(201)
      .json({ message: "Doctor added successfully", result: result.rows[0] });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const addTeacher = async (
  req: express.Request,
  res: express.Response
) => {
  const { teacherId } = req.body;
  console.log(teacherId);
  try {
    const result = await pool.query(
      "INSERT INTO teachers (id_assigned) VALUES ($1)",
      [teacherId]
    );
    return res.status(201).json({ message: "Teacher added successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const viewUserProfiles = async (
  req: express.Request,
  res: express.Response
) => {
  const { role } = req.params;
  try {
    const users = await pool.query("SELECT * FROM users WHERE role = $1", [
      role,
    ]);
    res.status(200).json(users.rows);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const viewCourseDetails = async (
  req: express.Request,
  res: express.Response
) => {
  const { courseId } = req.params;
  try {
    const course = await getCourseById(courseId);
    const reviews = await getReviewsByCourseId(courseId);
    res.status(200).json({ course, reviews });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const adminChat = async (
  req: express.Request,
  res: express.Response
) => {
  const { senderId, receiverId, message } = req.body;
  try {
    const chat = await createChatMessage({ senderId, receiverId, message });
    res.status(201).json(chat);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
