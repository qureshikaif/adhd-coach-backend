import express from "express";
import {
  getAllTeachers,
  getNumberOfTeachers,
  getAllTeacherCourses,
  addTeacherFeedback,
  addLecture,
  addQuiz,
} from "../controllers/teacherController";

const router = express.Router();

router.get("/get-teachers", getAllTeachers);
router.get("/get-number", getNumberOfTeachers);
router.get("/get-courses/:id", getAllTeacherCourses);
router.post("/add-feedback", addTeacherFeedback);
router.post("/add-lecture", addLecture);
router.post("/add-quiz", addQuiz);

export default router;
