import express from "express";
import {
  getAllParents,
  getChildPrescriptions,
  addParentFeedback,
  getAllDoctors,
  assignDoctor,
  checkDoctor,
  getChildProgressReport,
  getChildDoctorRemarks,
} from "../controllers/parentController";

const router = express.Router();

router.get("/get-parents", getAllParents);
router.get("/get-prescriptions/:id", getChildPrescriptions);
router.post("/add-feedback", addParentFeedback);
router.post("/assign-doctor", assignDoctor);
router.get("/get-doctors", getAllDoctors);
router.get("/check-doctor/:childId", checkDoctor);
router.get("/progress-report/:childId", getChildProgressReport);
router.get("/doctor-remarks/:childId", getChildDoctorRemarks);

export default router;
