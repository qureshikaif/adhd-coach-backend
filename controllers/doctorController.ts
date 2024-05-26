import { getAppointmentsByDoctorId } from "../models/appointmentModel.js";
import { findUserById } from "../models/userModel.js";
import { createChatMessage } from "../models/chatModel.js";
import express from "express";

export const viewAppointments = async (
  req: express.Request,
  res: express.Response
) => {
  const { doctorId } = req.params;
  try {
    const appointments = await getAppointmentsByDoctorId(doctorId);
    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const viewPatientProfile = async (
  req: express.Request,
  res: express.Response
) => {
  const { patientId } = req.params;
  try {
    const patient = await findUserById(patientId);
    res.status(200).json(patient);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const prescribeMedicine = async (
  req: express.Request,
  res: express.Response
) => {
  const { patientId, prescription } = req.body;
  try {
    // Logic for saving prescription
    res.status(201).json({ message: "Prescription added" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const doctorChat = async (
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

export const viewDoctorProfile = async (
  req: express.Request,
  res: express.Response
) => {
  const { doctorId } = req.params;
  try {
    const doctor = await findUserById(doctorId);
    res.status(200).json(doctor);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
