import express from "express";
import {
  viewChildProgress,
  parentChat,
  viewParentProfile,
  getAllParents,
  getChildPrescriptions,
} from "../controllers/parentController";

const router = express.Router();

router.get("/progress/:childId", viewChildProgress);
router.post("/chat", parentChat);
router.get("/profile/:parentId", viewParentProfile);
router.get("/get-parents", getAllParents);
router.get("/get-prescriptions/:id", getChildPrescriptions);
export default router;
