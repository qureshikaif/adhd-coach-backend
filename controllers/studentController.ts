import {
  createAssessment,
  getAssessmentsByStudentId,
} from "../models/assessmentModal";
import { createUser, findUserByEmail } from "../models/userModel";
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
