import express from "express";
import {
  addCourse,
  addArticle,
  viewUserProfiles,
  viewCourseDetails,
  adminChat,
} from "../controllers/adminController.js";

const router = express.Router();

router.post("/course", addCourse);
router.post("/article", addArticle);
router.get("/users/:role", viewUserProfiles);
router.get("/course/:courseId", viewCourseDetails);
router.post("/chat", adminChat);

export default router;
