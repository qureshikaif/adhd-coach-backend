import {
  createCourse,
  getCourseById,
  getAllCourses,
} from "../models/courseModel.js";
import { createArticle } from "../models/articleModel.js";
import { getReviewsByCourseId } from "../models/reviewModel.js";
import { createChatMessage, getChatMessages } from "../models/chatModel.js";
import pool from "../db.ts";
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
  const { title, subtitle, tags, content, summary, adminId } = req.body;
  try {
    const article = await createArticle({
      title,
      subtitle,
      tags,
      content,
      summary,
      adminId,
    });
    res.status(201).json(article);
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
