import { getAppointmentsByDoctorId } from "../models/appointmentModel";
import { findUserById } from "../models/userModel";
import { createChatMessage } from "../models/chatModel";
import express from "express";
import pool from "../db";
import { createFeedback } from "../models/feedback";

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
  const { prescription, patientId, doctorId } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO prescriptions (prescription, patient_id, doctor_id) VALUES ($1, $2, $3)",
      [prescription, patientId, doctorId]
    );
    res.status(201).json({ message: "Prescription added", result });
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

export const getAllDoctors = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const result = await pool.query("SELECT * FROM doctors");
    const doctorsWithRole = result.rows.map((doctor) => {
      return { ...doctor, role: "Doctor" };
    });
    res.status(200).json(doctorsWithRole);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const addDoctorFeedback = async (
  req: express.Request,
  res: express.Response
) => {
  const { feedback, userId } = req.body;
  try {
    const newFeedback = await createFeedback(
      "doctor_feedbacks",
      feedback,
      userId
    );
    res.status(201).json(newFeedback);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const getStudents = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { doctorId } = req.params;

    const query = `
    SELECT s.*, pr.remarks AS teacher_remarks, t.full_name AS teacher_name
    FROM students s
    INNER JOIN doctor_assignments da ON s.id_assigned = da.student_id
    LEFT JOIN progress_reports pr ON s.id_assigned = pr.student_id
    LEFT JOIN teachers t ON pr.teacher_id = t.id_assigned
    WHERE da.doctor_id = $1
    `;

    const { rows } = await pool.query(query, [doctorId]);

    res.status(200).json(rows);
  } catch (error) {
    console.error("Error fetching students by doctor:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const addRemarks = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { doctorId, studentId, remarks } = req.body;

    const query = `
      INSERT INTO doctor_remarks (doctor_id, student_id, remark, date)
      VALUES ($1, $2, $3, CURRENT_TIMESTAMP)
      RETURNING *
    `;
    const values = [doctorId, studentId, remarks];

    const { rows } = await pool.query(query, values);

    res.status(201).json(rows[0]);
  } catch (error) {
    console.error("Error adding doctor remark:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
