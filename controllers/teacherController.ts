import { getCourseById } from "../models/courseModel.js";
import { createChatMessage, getChatMessages } from "../models/chatModel.js";
import { findUserById } from "../models/userModel.js";
import express from "express";

export const viewCourseStatistics = async (
  req: express.Request,
  res: express.Response
) => {
  const { courseId } = req.params;
  try {
    const course = await getCourseById(courseId);
    res.status(200).json(course);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const addLectureOrAssignment = async (
  req: express.Request,
  res: express.Response
) => {
  // Implementation for adding lecture or assignment
};

export const teacherChat = async (
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

export const viewTeacherProfile = async (
  req: express.Request,
  res: express.Response
) => {
  const { teacherId } = req.params;
  try {
    const teacher = await findUserById(teacherId);
    res.status(200).json(teacher);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
