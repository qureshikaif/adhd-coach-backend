import pool from "../db";
import {
  createAssessment,
  getAssessmentsByStudentId,
} from "../models/assessmentModal";
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

export const getAllStudents = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const result = await pool.query("SELECT * FROM students");
    const studentsWithRole = result.rows.map((student) => {
      return { ...student, role: "student" };
    });
    res.status(200).json(studentsWithRole);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const getNumberOfStudents = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const result = await pool.query("SELECT COUNT(*) FROM students");

    res.status(200).json(result.rows[0].count);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
