import express from "express";
import {
  addCourse,
  addArticle,
  addTeacher,
  addDoctor,
  deleteTeacher,
  deleteDoctor,
  deleteStudent,
  deleteParent,
  deleteCourse,
  deleteArticle,
  getCoursesStudentCount,
} from "../controllers/adminController";
import { getAllArticles } from "../models/articleModel";
import { getAllCourses } from "../models/courseModel";
import { getAllFeedbacks } from "../models/feedback";

const router = express.Router();

router.post("/course", addCourse);
router.post("/article", addArticle);
router.post("/teacher", addTeacher);
router.post("/doctor", addDoctor);
router.get("/get-articles", getAllArticles);
router.get("/get-courses", getAllCourses);
router.get("/all-feedbacks", getAllFeedbacks);
router.delete("/teacher/:id", deleteTeacher);
router.delete("/doctor/:id", deleteDoctor);
router.delete("/student/:id", deleteStudent);
router.delete("/parent/:id", deleteParent);
router.delete("/course/:id", deleteCourse);
router.delete("/article/:id", deleteArticle);
router.get("/course-student", getCoursesStudentCount);

export default router;
