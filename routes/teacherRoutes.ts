import express from "express";
import {
  viewCourseStatistics,
  addLectureOrAssignment,
  teacherChat,
  viewTeacherProfile,
  getAllTeachers,
  getNumberOfTeachers,
  getAllTeacherCourses,
  addTeacherFeedback,
} from "../controllers/teacherController";

const router = express.Router();

router.get("/course/:courseId/statistics", viewCourseStatistics);
router.post("/lecture-assignment", addLectureOrAssignment);
router.post("/chat", teacherChat);
router.get("/profile/:teacherId", viewTeacherProfile);
router.get("/get-teachers", getAllTeachers);
router.get("/get-number", getNumberOfTeachers);
router.get("/get-courses/:id", getAllTeacherCourses);
router.post("/add-feedback", addTeacherFeedback);

export default router;
