import { Server } from "socket.io";
import express from "express";
import cors from "cors";
import http from "http";
import pool from "./db";
import authRoutes from "./routes/authRoutes";
import adminRoutes from "./routes/adminRoutes";
import parentRoutes from "./routes/parentRoutes";
import teacherRoutes from "./routes/teacherRoutes";
import doctorRoutes from "./routes/doctorRoutes";
import studentRoutes from "./routes/studentRoutes";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req: express.Request, res: express.Response) => {
  res.json({ message: "Hello World", pool });
});

app.get(
  "/api/quizzes/:id",
  async (req: express.Request, res: express.Response) => {
    const quizId = req.params.id;

    try {
      const quizResult = await pool.query(
        "SELECT q.id, q.title, q.instructor, t.full_name AS instructor_name FROM quizzes q JOIN teachers t ON q.instructor = t.id_assigned WHERE q.id = $1",
        [quizId]
      );
      const quiz = quizResult.rows[0];

      if (!quiz) {
        return res
          .status(404)
          .send({ success: false, message: "Quiz not found" });
      }

      const questionsResult = await pool.query(
        "SELECT * FROM quiz_questions WHERE quiz_id = $1",
        [quizId]
      );
      const questions = questionsResult.rows;

      res.status(200).send({ success: true, quiz, questions });
    } catch (error) {
      console.error(error);
      res.status(500).send({ success: false, error: "Database error" });
    }
  }
);

app.get("/api/quizzes", async (req: express.Request, res: express.Response) => {
  try {
    const quizzesResult = await pool.query(
      `SELECT q.id AS quiz_id, q.title AS quiz_title, t.full_name AS teacher_name,
              qq.id AS question_id, qq.question, qq.option_1, qq.option_2, qq.option_3, qq.option_4, qq.answer
      FROM quizzes q
      JOIN quiz_questions qq ON q.id = qq.quiz_id
      JOIN teachers t ON q.instructor = t.id_assigned`
    );

    const quizzes = quizzesResult.rows.reduce(
      (accumulator: any[], quiz: any) => {
        const existingQuiz = accumulator.find(
          (item) => item.quiz_id === quiz.quiz_id
        );
        if (existingQuiz) {
          existingQuiz.questions.push({
            question_id: quiz.question_id,
            question: quiz.question,
            option_1: quiz.option_1,
            option_2: quiz.option_2,
            option_3: quiz.option_3,
            option_4: quiz.option_4,
            answer: quiz.answer,
          });
        } else {
          accumulator.push({
            quiz_id: quiz.quiz_id,
            quiz_title: quiz.quiz_title,
            teacher_name: quiz.teacher_name,
            questions: [
              {
                question_id: quiz.question_id,
                question: quiz.question,
                option_1: quiz.option_1,
                option_2: quiz.option_2,
                option_3: quiz.option_3,
                option_4: quiz.option_4,
                answer: quiz.answer,
              },
            ],
          });
        }
        return accumulator;
      },
      []
    );

    res.status(200).send({ success: true, quizzes });
  } catch (error) {
    console.error(error);
    res.status(500).send({ success: false, error: "Database error" });
  }
});

app.use("/auth", authRoutes);
app.use("/admin", adminRoutes);
app.use("/parent", parentRoutes);
app.use("/teacher", teacherRoutes);
app.use("/doctor", doctorRoutes);
app.use("/student", studentRoutes);

// io.on("connection", (socket) => {
//   console.log("a user connected", socket.id);

//   socket.on("send message", (msg) => {
//     console.log("message: " + msg);
//     socket.broadcast.emit("recieve message", msg);
//   });

//   socket.on("disconnect", () => {
//     console.log("user disconnected");
//   });
// });

app.listen(8080, () => {
  console.log("Server is running on port 8080");
});
