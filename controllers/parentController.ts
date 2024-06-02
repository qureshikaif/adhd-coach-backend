import { getAssessmentsByStudentId } from "../models/assessmentModal";
import { getAllArticles } from "../models/articleModel";
import { createChatMessage } from "../models/chatModel";
import { findUserById } from "../models/userModel";
import express from "express";
import pool from "../db";

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
      return { ...parent, role: "parent" };
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
