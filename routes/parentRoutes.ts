import express from "express";
import {
  getAllParents,
  getChildPrescriptions,
  addParentFeedback,
  getAllDoctors,
  assignDoctor,
} from "../controllers/parentController";

const router = express.Router();

router.get("/get-parents", getAllParents);
router.get("/get-prescriptions/:id", getChildPrescriptions);
router.post("/add-feedback", addParentFeedback);
router.post("/assign-doctor", assignDoctor);
router.get("/get-doctors", getAllDoctors);

export default router;
