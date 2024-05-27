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

const router = express.Router();

router.post("/course", addCourse);
router.post("/article", addArticle);
router.get("/users/:role", viewUserProfiles);
router.get("/course/:courseId", viewCourseDetails);
router.post("/chat", adminChat);
router.post("/teacher", addTeacher);
router.post("/doctor", addDoctor);

export default router;
