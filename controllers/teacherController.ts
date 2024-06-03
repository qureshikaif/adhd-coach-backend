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
        json_agg(
          json_build_object(
            'id', c.id,
            'title', c.title
          )
        ) AS courses
      FROM teachers t
      LEFT JOIN courses c ON t.id_assigned = c.instructor
      WHERE t.id_assigned = $1
      GROUP BY t.id, t.id_assigned, t.full_name, t.email, t.password;
    `;

    const result = await pool.query(teacherQuery, [teacherId]);

    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ message: "Teacher with id_assigned not found" });
    }

    return res.status(200).json(result.rows[0]);
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
};

export const addTeacherFeedback = async (
  req: express.Request,
  res: express.Response
) => {
  const { feedback, userId } = req.body;
  try {
    const newFeedback = await createFeedback(
      "teacher_feedbacks",
      feedback,
      userId
    );
    res.status(201).json(newFeedback);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const addLecture = async (
  req: express.Request,
  res: express.Response
) => {
  const { lectureLink, courseId, instructorId } = req.body;

  if (!lectureLink || !courseId || !instructorId) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const courseResult = await pool.query(
      "SELECT * FROM courses WHERE id = $1",
      [courseId]
    );
    if (courseResult.rowCount === 0) {
      return res.status(404).json({ message: "Course not found" });
    }

    const instructorResult = await pool.query(
      "SELECT * FROM teachers WHERE id_assigned = $1",
      [instructorId]
    );
    if (instructorResult.rowCount === 0) {
      return res.status(404).json({ message: "Instructor not found" });
    }

    const insertResult = await pool.query(
      "INSERT INTO lectures (lecture_link, course_id, instructor) VALUES ($1, $2, $3) RETURNING *",
      [lectureLink, courseId, instructorId]
    );

    res.status(201).json(insertResult.rows[0]);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const addQuiz = async (req: express.Request, res: express.Response) => {
  const { instructor, courseId, title, questions } = req.body;

  try {
    const quizResult = await pool.query(
      "INSERT INTO quizzes (instructor, course_id, title) VALUES ($1, $2, $3) RETURNING id",
      [instructor, courseId, title]
    );
    const quizId = quizResult.rows[0].id;

    const questionPromises = questions.map((q: any) =>
      pool.query(
        "INSERT INTO quiz_questions (quiz_id, question, option_1, option_2, option_3, option_4, answer) VALUES ($1, $2, $3, $4, $5, $6, $7)",
        [
          quizId,
          q.question,
          q.option1,
          q.option2,
          q.option3,
          q.option4,
          q.answer,
        ]
      )
    );
    await Promise.all(questionPromises);

    res.status(201).send({ success: true, quizId });
  } catch (error) {
    console.error(error);
    res.status(500).send({ success: false, error: "Database error" });
  }
};
