import express from "express";
import {
  viewChildProgress,
  readArticles,
  parentChat,
  viewParentProfile,
} from "../controllers/parentController.js";

const router = express.Router();

router.get("/progress/:childId", viewChildProgress);
router.get("/articles", readArticles);
router.post("/chat", parentChat);
router.get("/profile/:parentId", viewParentProfile);

export default router;
