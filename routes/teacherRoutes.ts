import express from "express";
import {
  viewCourseStatistics,
  addLectureOrAssignment,
  teacherChat,
  viewTeacherProfile,
} from "../controllers/teacherController.js";

const router = express.Router();

router.get("/course/:courseId/statistics", viewCourseStatistics);
router.post("/lecture-assignment", addLectureOrAssignment);
router.post("/chat", teacherChat);
router.get("/profile/:teacherId", viewTeacherProfile);

export default router;
