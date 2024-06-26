import pool from "../db";
import express from "express";
import { CourseType } from "../types/CourseType";

export const createCourse = async (course: any) => {
  const { title, instructor, compulsory } = course;
  const result = await pool.query(
    "INSERT INTO courses (title, instructor, compulsory) VALUES ($1, $2, $3) RETURNING *",
    [title, instructor, compulsory]
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
    const courses = await pool.query(`
      SELECT 
        courses.*, 
        teachers.id_assigned AS teacher_id, 
        teachers.full_name AS teacher_name 
      FROM courses 
      LEFT JOIN teachers ON courses.instructor = teachers.id_assigned
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

export const findCourseByTitle = async (title: string) => {
  const result = await pool.query("SELECT * FROM courses WHERE title = $1", [
    title,
  ]);
  return result.rows[0];
};

export const checkCompulsoryCoursesCompletion = async (studentId: number) => {
  try {
    const result = await pool.query(
      `
      SELECT 
        (SELECT COUNT(*) FROM quizzes q
         JOIN quiz_scores qs ON q.id = qs.quiz_id
         JOIN courses c ON q.course_id = c.id
         WHERE c.title = 'English' AND qs.student_id = $1) AS english_quiz_count,
        (SELECT COUNT(*) FROM quizzes q
         JOIN quiz_scores qs ON q.id = qs.quiz_id
         JOIN courses c ON q.course_id = c.id
         WHERE c.title = 'Maths' AND qs.student_id = $1) AS maths_quiz_count
    `,
      [studentId]
    );

    const { english_quiz_count, maths_quiz_count } = result.rows[0];

    if (english_quiz_count > 0 && maths_quiz_count > 0) {
      await pool.query(
        `
        UPDATE students
        SET compulsory_courses_completed = TRUE
        WHERE id_assigned = $1
      `,
        [studentId]
      );

      return true;
    }

    return false;
  } catch (error) {
    console.error("Error checking compulsory courses completion:", error);
    throw error;
  }
};

export const getCoursesWithStudentCount = async () => {
  const query = `
    SELECT c.id, c.title, COUNT(sc.student_id) AS student_count
    FROM courses c
    LEFT JOIN student_courses sc ON c.id = sc.course_id
    GROUP BY c.id
  `;
  const { rows } = await pool.query(query);
  return rows;
};
