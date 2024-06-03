import express from "express";
import {
  getAllTeachers,
  getNumberOfTeachers,
  getAllTeacherCourses,
  addTeacherFeedback,
  addLecture,
  addQuiz,
  getStudentCourseCount,
  getStudentCourseDetails,
} from "../controllers/teacherController";

const router = express.Router();

router.get("/get-teachers", getAllTeachers);
router.get("/get-number", getNumberOfTeachers);
router.get("/get-courses/:id", getAllTeacherCourses);
router.post("/add-feedback", addTeacherFeedback);
router.post("/add-lecture", addLecture);
router.post("/add-quiz", addQuiz);
router.get("/get-count-students/:id", getStudentCourseCount);
router.get("/get-student-courses/:id", getStudentCourseDetails);

export default router;
