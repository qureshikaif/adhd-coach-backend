import express from "express";
import {
  addCourse,
  addArticle,
  addTeacher,
  addDoctor,
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

export default router;
