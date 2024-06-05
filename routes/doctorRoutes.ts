import express from "express";
import {
  prescribeMedicine,
  getAllDoctors,
  addDoctorFeedback,
  getStudents,
  addRemarks,
} from "../controllers/doctorController";

const router = express.Router();

router.post("/prescription", prescribeMedicine);
router.get("/get-doctors", getAllDoctors);
router.post("/add-feedback", addDoctorFeedback);
router.get("/students/:doctorId", getStudents);
router.post("/remarks", addRemarks);

export default router;
