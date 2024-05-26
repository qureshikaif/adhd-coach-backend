import express from "express";
import {
  takeAssessment,
  playGames,
  giveGrandTest,
  signup,
} from "../controllers/studentController.ts";

const router = express.Router();

router.post("/assessment", takeAssessment);
router.post("/games", playGames);
router.post("/grand-test", giveGrandTest);
router.post("/signup", signup);

export default router;
