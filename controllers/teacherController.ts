import { getCourseById } from "../models/courseModel";
import { createChatMessage, getChatMessages } from "../models/chatModel";
import { findUserById } from "../models/userModel";
import express from "express";
import pool from "../db";
import { createFeedback } from "../models/feedback";

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

export const getAllTeachers = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const result = await pool.query("SELECT * FROM teachers");
    const teachersWithRole = result.rows.map((teacher) => {
      return { ...teacher, role: "teacher" };
    });
    res.status(200).json(teachersWithRole);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const getNumberOfTeachers = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const result = await pool.query("SELECT COUNT(*) FROM teachers");

    res.status(200).json(result.rows[0].count);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const getAllTeacherCourses = async (
  req: express.Request,
  res: express.Response
) => {
  const teacherId = req.params.id;
  try {
    const teacherQuery = `
      SELECT
        t.id,
        t.id_assigned,
        t.full_name,
        t.email,
        t.password,
        t.personal_info,
        json_agg(
          json_build_object(
            'id', c.id,
            'title', c.title,
            'description', c.description
          )
        ) AS courses
      FROM teachers t
      LEFT JOIN courses c ON t.id_assigned = c.instructor
      WHERE t.id_assigned = $1
      GROUP BY t.id, t.id_assigned, t.full_name, t.email, t.password, t.personal_info;
    `;

    const result = await pool.query(teacherQuery, [teacherId]);

    if (result.rows.length === 0) {
      res.status(404).json({ messgae: "Teacher with id_assigned not found" });
    }

    return res.status(200).json(result.rows[0]);
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
};

export const addTeacherFeedback = async (req: express.Request, res: express.Response) => {
  const { feedback, userId } = req.body;
  try {
    const newFeedback = await createFeedback("teacher_feedbacks", feedback, userId);
    res.status(201).json(newFeedback);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};