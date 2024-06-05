import express from "express";
import {
  getAllStudents,
  getNumberOfStudents,
  getCourses,
  enrollInCourse,
  getCompulsoryCourses,
  submitQuiz,
  getOptionalCourses,
  getMood,
  checkCompulsoryCourses,
} from "../controllers/studentController";

const router = express.Router();

router.get("/get-students", getAllStudents);
router.get("/get-number", getNumberOfStudents);
router.get("/get-courses/:id", getCourses);
router.post("/enroll", enrollInCourse);
router.get("/get-compulsory-courses", getCompulsoryCourses);
router.post("/submit-quiz", submitQuiz);
router.get("/get-all-optional-courses/:id", getOptionalCourses);
router.post("/mood", getMood);
router.post("/check-compulsory", checkCompulsoryCourses);

export default router;
