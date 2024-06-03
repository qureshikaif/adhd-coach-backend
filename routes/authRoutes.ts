import express from "express";
import {
  forgotPasswordEmail,
  forgotPasswordVerify,
  signin,
  signup,
  updatePassword,
} from "../controllers/authController";

const router = express.Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.post("/send-otp", forgotPasswordEmail);
router.post("/verify-otp", forgotPasswordVerify);
router.post("/password", updatePassword);

export default router;
