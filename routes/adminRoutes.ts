import express from "express";
import {
  addCourse,
  addArticle,
  viewUserProfiles,
  viewCourseDetails,
  adminChat,
  addTeacher,
  addDoctor,
} from "../controllers/adminController";
import { getAllArticles } from "../models/articleModel";
import { getAllCourses } from "../models/courseModel";
import { getAllFeedbacks } from "../models/feedback";

const router = express.Router();

router.post("/course", addCourse);
router.post("/article", addArticle);
router.get("/users/:role", viewUserProfiles);
router.get("/course/:courseId", viewCourseDetails);
router.post("/chat", adminChat);
router.post("/teacher", addTeacher);
router.post("/doctor", addDoctor);
router.get("/get-articles", getAllArticles);
router.get("/get-courses", getAllCourses);
router.get("/all-feedbacks", getAllFeedbacks)

export default router;
