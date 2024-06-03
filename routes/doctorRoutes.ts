import express from "express";
import {
  viewAppointments,
  viewPatientProfile,
  prescribeMedicine,
  doctorChat,
  viewDoctorProfile,
  getAllDoctors,
  addDoctorFeedback,
} from "../controllers/doctorController";

const router = express.Router();

router.get("/appointments/:doctorId", viewAppointments);
router.get("/patient/:patientId", viewPatientProfile);
router.post("/prescription", prescribeMedicine);
router.post("/chat", doctorChat);
router.get("/profile/:doctorId", viewDoctorProfile);
router.get("/get-doctors", getAllDoctors);
router.post("/add-feedback", addDoctorFeedback);

export default router;
