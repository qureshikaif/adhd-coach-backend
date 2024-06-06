import { createCourse, findCourseByTitle } from "../models/courseModel";
import { createArticle } from "../models/articleModel";
import { createChatMessage } from "../models/chatModel";
import pool from "../db";
import express from "express";
import {
  sendDoctorIdByEmail,
  sendTeacherIdByEmail,
} from "../models/nodemailer";

export const addCourse = async (
  req: express.Request,
  res: express.Response
) => {
  const { title, instructor, compulsory } = req.body;
  try {
    const existingCourse = await findCourseByTitle(title);
    if (existingCourse) {
      return res.status(400).json({ message: "Course already exists" });
    }

    const course = await createCourse({ title, instructor, compulsory });
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
    res.status(201).json({ message: "Article added successfully", article });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const addDoctor = async (
  req: express.Request,
  res: express.Response
) => {
  const { doctorId, email } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO doctors (id_assigned) VALUES ($1) RETURNING *",
      [doctorId]
    );

    await sendDoctorIdByEmail(email, doctorId);

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
  const { teacherId, email } = req.body;
  console.log(teacherId);
  try {
    const result = await pool.query(
      "INSERT INTO teachers (id_assigned) VALUES ($1)",
      [teacherId]
    );

    await sendTeacherIdByEmail(email, teacherId);
    return res
      .status(201)
      .json({ message: "Teacher added successfully", result: result.rows[0] });
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

export const deleteTeacher = async (
  req: express.Request,
  res: express.Response
) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "DELETE FROM teachers WHERE id = $1 RETURNING *",
      [id]
    );
    if (result.rowCount === 0) {
      return res.status(404).send("Teacher not found");
    }
    res.send(result.rows[0]);
  } catch (error) {
    res.status(500).send("Server error");
  }
};

export const deleteDoctor = async (
  req: express.Request,
  res: express.Response
) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "DELETE FROM doctors WHERE id = $1 RETURNING *",
      [id]
    );
    if (result.rowCount === 0) {
      return res.status(404).send("Doctor not found");
    }
    res.send(result.rows[0]);
  } catch (error) {
    res.status(500).send("Server error");
  }
};

export const deleteStudent = async (
  req: express.Request,
  res: express.Response
) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "DELETE FROM students WHERE id = $1 RETURNING *",
      [id]
    );
    if (result.rowCount === 0) {
      return res.status(404).send("Student not found");
    }
    res.send(result.rows[0]);
  } catch (error) {
    res.status(500).send("Server error");
  }
};

export const deleteParent = async (
  req: express.Request,
  res: express.Response
) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "DELETE FROM parents WHERE id = $1 RETURNING *",
      [id]
    );
    if (result.rowCount === 0) {
      return res.status(404).send("Parent not found");
    }
    res.send(result.rows[0]);
  } catch (error) {
    res.status(500).send("Server error");
  }
};

export const deleteCourse = async (
  req: express.Request,
  res: express.Response
) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      "DELETE FROM courses WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Course not found" });
    }

    res.json({
      message: "Course deleted successfully",
      course: result.rows[0],
    });
  } catch (error) {
    console.error("Error deleting course:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteArticle = async (
  req: express.Request,
  res: express.Response
) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      "DELETE FROM articles WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Article not found" });
    }

    res.json({
      message: "Article deleted successfully",
      article: result.rows[0],
    });
  } catch (error) {
    console.error("Error deleting article:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
