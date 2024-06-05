import { getAssessmentsByStudentId } from "../models/assessmentModal";
import { getAllArticles } from "../models/articleModel";
import { createChatMessage } from "../models/chatModel";
import { findUserById } from "../models/userModel";
import express from "express";
import pool from "../db";
import { createFeedback } from "../models/feedback";

export const viewChildProgress = async (
  req: express.Request,
  res: express.Response
) => {
  const { childId } = req.params;
  try {
    const assessments = await getAssessmentsByStudentId(childId);
    res.status(200).json(assessments);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const addParentFeedback = async (
  req: express.Request,
  res: express.Response
) => {
  const { feedback, userId } = req.body;
  try {
    const newFeedback = await createFeedback(
      "parent_feedbacks",
      feedback,
      userId
    );
    res.status(201).json(newFeedback);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const parentChat = async (
  req: express.Request,
  res: express.Response
) => {
  const { senderId, receiverId, message } = req.body;
  try {
    const chat = await createChatMessage({ senderId, receiverId, message });
    res.status(201).json(chat);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const viewParentProfile = async (
  req: express.Request,
  res: express.Response
) => {
  const { parentId } = req.params;
  try {
    const parent = await findUserById(parentId);
    res.status(200).json(parent);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const getAllParents = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const result = await pool.query("SELECT * FROM parents");
    const parentsWithRole = result.rows.map((parent) => {
      return { ...parent, role: "Parent" };
    });
    res.status(200).json(parentsWithRole);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const getChildPrescriptions = async (
  req: express.Request,
  res: express.Response
) => {
  const childId = req.params.id;
  try {
    const result = await pool.query(
      `SELECT prescriptions.*, doctors.full_name AS doctor_name, doctors.personal_info AS doctor_info
       FROM prescriptions
       JOIN doctors ON prescriptions.doctor_id = doctors.id_assigned
       WHERE prescriptions.patient_id = $1`,
      [childId]
    );

    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ message: "No prescriptions found for this child" });
    }

    res.status(200).json(result.rows);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const getAllDoctors = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const result = await pool.query("SELECT * FROM doctors");
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching doctors:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const assignDoctor = async (
  req: express.Request,
  res: express.Response
) => {
  const { parentId, studentId, doctorId } = req.body;
  try {
    const existingAssignment = await pool.query(
      `SELECT id FROM doctor_assignments WHERE parent_id = $1 AND student_id = $2 AND doctor_id = $3`,
      [parentId, studentId, doctorId]
    );

    if (existingAssignment) {
      return res
        .status(400)
        .json({ message: "This doctor is already assigned to the student." });
    }

    const result = await pool.query(
      `INSERT INTO doctor_assignments (parent_id, student_id, doctor_id) VALUES ($1, $2, $3) RETURNING *`,
      [parentId, studentId, doctorId]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error assigning doctor", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
