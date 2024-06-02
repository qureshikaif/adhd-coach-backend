import express from "express";
import {
  takeAssessment,
  playGames,
  giveGrandTest,
  getAllStudents,
  getNumberOfStudents,
} from "../controllers/studentController";

const router = express.Router();

router.post("/assessment", takeAssessment);
router.post("/games", playGames);
router.post("/grand-test", giveGrandTest);
router.get("/get-students", getAllStudents);
router.get("/get-number", getNumberOfStudents);
// router.post("/signup", signup);

export default router;
