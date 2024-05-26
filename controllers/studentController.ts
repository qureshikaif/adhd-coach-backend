import {
  createAssessment,
  getAssessmentsByStudentId,
} from "../models/assessmentModal.js";
import { createUser, findUserByEmail } from "../models/userModel.js";
import bcrypt from "bcrypt";
import express from "express";

export const takeAssessment = async (
  req: express.Request,
  res: express.Response
) => {
  const { studentId, score } = req.body;
  try {
    const assessment = await createAssessment({ studentId, score });
    res.status(201).json(assessment);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const playGames = async (
  req: express.Request,
  res: express.Response
) => {
  // Logic for playing games
};

export const giveGrandTest = async (
  req: express.Request,
  res: express.Response
) => {
  const { studentId, score } = req.body;
  try {
    const assessment = await createAssessment({ studentId, score });
    res.status(201).json(assessment);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const signup = async (req: express.Request, res: express.Response) => {
  const { fullName, email, password, role } = req.body;

  try {
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await createUser({
      fullName,
      email,
      password: hashedPassword,
      role,
    });

    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
