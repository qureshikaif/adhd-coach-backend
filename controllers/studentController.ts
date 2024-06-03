import pool from "../db";
import express from "express";

export const getAllStudents = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const result = await pool.query("SELECT * FROM students");
    const studentsWithRole = result.rows.map((student) => {
      return { ...student, role: "Student" };
    });
    res.status(200).json(studentsWithRole);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const getNumberOfStudents = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const result = await pool.query("SELECT COUNT(*) FROM students");

    res.status(200).json(result.rows[0].count);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const getCourses = async (
  req: express.Request,
  res: express.Response
) => {
  const studentId = req.params.id;

  if (!studentId) {
    return res.status(400).json({ message: "Student ID is required" });
  }

  try {
    const query = `
      SELECT 
        c.id AS course_id, 
        c.title AS course_title, 
        c.compulsory AS course_compulsory, 
        t.id_assigned AS teacher_id,
        t.full_name AS teacher_name, 
        t.email AS teacher_email 
      FROM 
        student_courses sc
      JOIN 
        courses c ON sc.course_id = c.id
      JOIN 
        teachers t ON c.instructor = t.id_assigned
      WHERE 
        sc.student_id = $1
    `;

    const result = await pool.query(query, [studentId]);

    if (result.rowCount === 0) {
      return res
        .status(404)
        .json({ message: "No courses found for this student" });
    }

    for (const row of result.rows) {
      const lecturesQuery = `
        SELECT 
          id, 
          lecture_link 
        FROM 
          lectures 
        WHERE 
          course_id = $1
      `;
      const lecturesResult = await pool.query(lecturesQuery, [row.course_id]);
      row.lectures = lecturesResult.rows;

      const quizzesQuery = `
        SELECT 
          q.id AS quiz_id,
          q.title AS quiz_title,
          qq.id AS question_id,
          qq.question AS question,
          qq.option_1,
          qq.option_2,
          qq.option_3,
          qq.option_4,
          qq.answer
        FROM 
          quizzes q
        JOIN 
          quiz_questions qq ON q.id = qq.quiz_id
        WHERE 
          q.course_id = $1
      `;
      const quizzesResult = await pool.query(quizzesQuery, [row.course_id]);
      row.quizzes = quizzesResult.rows;
    }

    res.status(200).json(result.rows);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const enrollInCourse = async (
  req: express.Request,
  res: express.Response
) => {
  const { studentId, courseId, teacherId } = req.body;

  try {
    const studentResult = await pool.query(
      "SELECT * FROM students WHERE id_assigned = $1",
      [studentId]
    );
    if (studentResult.rows.length === 0) {
      return res.status(404).json({ message: "Student not found" });
    }

    const courseResult = await pool.query(
      "SELECT * FROM courses WHERE id = $1",
      [courseId]
    );
    if (courseResult.rows.length === 0) {
      return res.status(404).json({ message: "Course not found" });
    }

    const teacherResult = await pool.query(
      "SELECT * FROM teachers WHERE id_assigned = $1",
      [teacherId]
    );
    if (teacherResult.rows.length === 0) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    if (courseResult.rows[0].instructor !== teacherId) {
      return res.status(400).json({
        message: "This course is not taught by the specified teacher",
      });
    }

    await pool.query(
      "INSERT INTO student_courses (student_id, course_id) VALUES ($1, $2)",
      [studentId, courseId]
    );

    res.status(200).json({ message: "Student enrolled successfully" });
  } catch (error) {
    console.error("Error enrolling student:", error);
    res.status(500).json({ message: "Server error" });
  }
};
