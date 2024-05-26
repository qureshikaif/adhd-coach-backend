import pool from "../db";

export const createAppointment = async (appointment: any) => {
  const { doctorId, studentId, time, reason } = appointment;
  const result = await pool.query(
    "INSERT INTO appointments (doctor_id, student_id, time, reason) VALUES ($1, $2, $3, $4) RETURNING *",
    [doctorId, studentId, time, reason]
  );
  return result.rows[0];
};

export const getAppointmentsByDoctorId = async (doctorId: any) => {
  const result = await pool.query(
    "SELECT * FROM appointments WHERE doctor_id = $1",
    [doctorId]
  );
  return result.rows;
};
