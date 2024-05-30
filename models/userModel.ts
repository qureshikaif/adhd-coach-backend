import pool from "../db";
import { UserType } from "../types/userType";

export const createUser = async (user: UserType) => {
  const { fullName, email, password, role } = user;
  const result = await pool.query(
    `INSERT INTO ${role.toLowerCase()}s (full_name, email, password) VALUES ($1, $2, $3) RETURNING *`,
    [fullName, email, password]
  );
  console.log(result.rows[0]);
  return result.rows[0];
};

export const findUserByEmail = async (
  email: string,
  role: string,
  id?: string
) => {
  console.log(email, role, id);

  if (role.toLowerCase() === "teacher" || role.toLowerCase() === "doctor") {
    if (id) {
      const result = await pool.query(
        `SELECT * FROM ${role.toLowerCase()}s WHERE email = $1 AND id_assigned = $2`,
        [email, id]
      );
      return result.rows[0];
    } else {
      throw new Error("ID NOT FOUND");
    }
  } else {
    const result = await pool.query(
      `SELECT * FROM ${role.toLowerCase()}s WHERE email = $1`,
      [email]
    );
    return result.rows[0];
  }
};

export const findUserById = async (id: string) => {
  const result = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
  return result.rows[0];
};
