import express from "express";
import {
  getAllParents,
  getChildPrescriptions,
  addParentFeedback,
} from "../controllers/parentController";

const router = express.Router();

router.get("/get-parents", getAllParents);
router.get("/get-prescriptions/:id", getChildPrescriptions);
router.post("/add-feedback", addParentFeedback);

export default router;
