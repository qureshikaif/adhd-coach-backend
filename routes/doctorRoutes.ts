import express from "express";
import {
  prescribeMedicine,
  getAllDoctors,
  addDoctorFeedback,
} from "../controllers/doctorController";

const router = express.Router();

router.post("/prescription", prescribeMedicine);
router.get("/get-doctors", getAllDoctors);
router.post("/add-feedback", addDoctorFeedback);

export default router;
