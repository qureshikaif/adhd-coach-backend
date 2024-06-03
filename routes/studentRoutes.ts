import express from "express";
import {
  getAllStudents,
  getNumberOfStudents,
  getCourses,
  enrollInCourse,
} from "../controllers/studentController";

const router = express.Router();

router.get("/get-students", getAllStudents);
router.get("/get-number", getNumberOfStudents);
router.get("/get-courses/:id", getCourses);
router.post("/enroll", enrollInCourse);

export default router;
