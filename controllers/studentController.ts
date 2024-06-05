import pool from "../db";
import express from "express";
import { checkCompulsoryCoursesCompletion } from "../models/courseModel";

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
    const coursesQuery = `
      SELECT 
        courses.*, 
        enrolled_date,
        teachers.id_assigned AS teacher_id,
        teachers.full_name AS teacher_name, 
        teachers.email AS teacher_email 
      FROM 
        student_courses
      JOIN 
        courses ON student_courses.course_id = courses.id
      JOIN 
        teachers ON courses.instructor = teachers.id_assigned
      WHERE 
        student_courses.student_id = $1
    `;

    const courses = await pool.query(coursesQuery, [studentId]);

    if (courses.rowCount === 0) {
      return res
        .status(404)
        .json({ message: "No courses found for this student" });
    }

    const courseData = await Promise.all(
      courses.rows.map(async (course) => {
        const lecturesQuery = `
          SELECT * FROM lectures WHERE course_id = $1`;
        const lectures = await pool.query(lecturesQuery, [course.id]);

        const quizzesQuery = `
          SELECT 
            quizzes.*, 
            array_agg(
              json_build_object(
                'question_id', quiz_questions.id,
                'title', quiz_questions.question,
                'options', ARRAY[quiz_questions.option_1, quiz_questions.option_2, quiz_questions.option_3, quiz_questions.option_4],
                'correct_answer', quiz_questions.answer
              )
            ) AS questions 
          FROM quizzes 
          LEFT JOIN quiz_questions ON quizzes.id = quiz_questions.quiz_id 
          WHERE course_id = $1 
          GROUP BY quizzes.id
        `;
        const quizzes = await pool.query(quizzesQuery, [course.id]);

        return {
          ...course,
          lectures: lectures.rows,
          quizzes: quizzes.rows.map((quiz) => ({
            ...quiz,
            questions: quiz.questions.filter((q: any) => q !== null),
          })),
        };
      })
    );

    return res.status(200).json(courseData);
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
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

export const getCompulsoryCourses = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const courses = await pool.query(`
      SELECT 
        courses.*, 
        teachers.id_assigned AS teacher_id, 
        teachers.full_name AS teacher_name 
      FROM courses 
      LEFT JOIN teachers ON courses.instructor = teachers.id_assigned
      WHERE courses.title IN ('Maths', 'English') AND courses.compulsory = true
    `);

    const courseData = await Promise.all(
      courses.rows.map(async (course) => {
        const lectures = await pool.query(
          `
        SELECT * FROM lectures WHERE course_id = $1
      `,
          [course.id]
        );

        const quizzes = await pool.query(
          `
        SELECT 
          quizzes.*, 
          array_agg(
            json_build_object(
              'question_id', quiz_questions.id,
              'title', quiz_questions.question,
              'options', ARRAY[quiz_questions.option_1, quiz_questions.option_2, quiz_questions.option_3, quiz_questions.option_4],
              'correct_answer', quiz_questions.answer
            )
          ) AS questions 
        FROM quizzes 
        LEFT JOIN quiz_questions ON quizzes.id = quiz_questions.quiz_id 
        WHERE course_id = $1 
        GROUP BY quizzes.id
      `,
          [course.id]
        );

        return {
          ...course,
          lectures: lectures.rows,
          quizzes: quizzes.rows.map((quiz: any) => ({
            ...quiz,
            questions: quiz.questions.filter((q: any) => q !== null),
          })),
        };
      })
    );

    return res.status(200).json(courseData);
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
};

export const submitQuiz = async (
  req: express.Request,
  res: express.Response
) => {
  const { quizId, studentId, teacherId, scores } = req.body;

  try {
    const existingScore = await pool.query(
      "SELECT * FROM quiz_scores WHERE quiz_id = $1 AND student_id = $2",
      [quizId, studentId]
    );

    if (existingScore.rowCount === 0) {
      await pool.query(
        "INSERT INTO quiz_scores (quiz_id, student_id, teacher_id, scores) VALUES ($1, $2, $3, $4)",
        [quizId, studentId, teacherId, scores]
      );
      res.json({ message: "Quiz submitted successfully." });
    } else {
      res.status(400).json({ message: "Quiz already submitted." });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};
export const getOptionalCourses = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const studentId = req.params.id;
    const courses = await pool.query(
      `
      SELECT 
        courses.*, 
        teachers.id_assigned AS teacher_id, 
        teachers.full_name AS teacher_name,
        EXISTS (
          SELECT 1 FROM student_courses WHERE student_id = $1 AND course_id = courses.id
        ) AS is_enrolled
      FROM courses 
      LEFT JOIN teachers ON courses.instructor = teachers.id_assigned
      WHERE courses.compulsory = false OR courses.compulsory IS NULL
    `,
      [studentId]
    );

    const courseData = await Promise.all(
      courses.rows.map(async (course) => {
        const lectures = await pool.query(
          `
        SELECT * FROM lectures WHERE course_id = $1
      `,
          [course.id]
        );

        const quizzes = await pool.query(
          `
        SELECT 
          quizzes.*, 
          array_agg(
            json_build_object(
              'question_id', quiz_questions.id,
              'title', quiz_questions.question,
              'options', ARRAY[quiz_questions.option_1, quiz_questions.option_2, quiz_questions.option_3, quiz_questions.option_4],
              'correct_answer', quiz_questions.answer
            )
          ) AS questions 
        FROM quizzes 
        LEFT JOIN quiz_questions ON quizzes.id = quiz_questions.quiz_id 
        WHERE course_id = $1 
        GROUP BY quizzes.id
      `,
          [course.id]
        );

        return {
          ...course,
          lectures: lectures.rows,
          quizzes: quizzes.rows.map((quiz: any) => ({
            ...quiz,
            questions: quiz.questions.filter((q: any) => q !== null),
          })),
        };
      })
    );

    return res.status(200).json(courseData);
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
};

export const getMood = async (req: express.Request, res: express.Response) => {
  const { studentId, mood } = req.body;

  if (!studentId || !mood) {
    return res.status(400).json({ error: "Student ID and mood are required." });
  }

  try {
    await pool.query(
      "INSERT INTO mood_entries (student_id, mood) VALUES ($1, $2)",
      [studentId, mood]
    );
    return res.status(201).json({ message: "Mood logged successfully." });
  } catch (error) {
    console.error("Error logging mood:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
};

export const checkCompulsoryCourses = async (
  req: express.Request,
  res: express.Response
) => {
  const { studentId } = req.body;

  if (!studentId) {
    return res.status(400).json({ message: "Student ID is required" });
  }

  try {
    const result = await checkCompulsoryCoursesCompletion(studentId);

    if (result) {
      return res.status(200).json({
        message: `Compulsory courses completed 🎉🎉.\n You can now attempt grand test.`,
        state: true,
      });
    } else {
      return res.status(200).json({
        message: "Compulsory courses not yet completed",
        state: false,
      });
    }
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
};
