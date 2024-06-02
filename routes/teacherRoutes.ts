import express from "express";
import {
  viewCourseStatistics,
  addLectureOrAssignment,
  teacherChat,
  viewTeacherProfile,
  getAllTeachers,
  getNumberOfTeachers,
} from "../controllers/teacherController";

const router = express.Router();

router.get("/course/:courseId/statistics", viewCourseStatistics);
router.post("/lecture-assignment", addLectureOrAssignment);
router.post("/chat", teacherChat);
router.get("/profile/:teacherId", viewTeacherProfile);
router.get("/get-teachers", getAllTeachers);
router.get("/get-number", getNumberOfTeachers);

export default router;
