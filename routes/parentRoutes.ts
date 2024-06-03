import express from "express";
import {
  viewChildProgress,
  parentChat,
  getAllParents,
  getChildPrescriptions,
  addParentFeedback,
} from "../controllers/parentController";

const router = express.Router();

router.get("/progress/:childId", viewChildProgress);
router.post("/chat", parentChat);
router.get("/get-parents", getAllParents);
router.get("/get-prescriptions/:id", getChildPrescriptions);
router.post("/add-feedback", addParentFeedback);

export default router;
