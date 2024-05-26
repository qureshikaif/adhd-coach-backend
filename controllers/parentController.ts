import { getAssessmentsByStudentId } from "../models/assessmentModal.ts";
import { getAllArticles } from "../models/articleModel.js";
import { createChatMessage } from "../models/chatModel.js";
import { findUserById } from "../models/userModel.js";
import express from "express";

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

export const readArticles = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const articles = await getAllArticles();
    res.status(200).json(articles);
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
