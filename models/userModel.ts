import { pool } from "../db";
import { userType } from "../types/userType";

export const createUser = async (user: userType) => {
  const { fullName, email, password, role } = user;
  const result = await pool.query(
    "INSERT INTO users (full_name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING *",
    [fullName, email, password, role]
  );
  return result.rows[0];
};

export const findUserByEmail = async (email: string) => {
  const result = await pool.query("SELECT * FROM users WHERE email = $1", [
    email,
  ]);
  return result.rows[0];
};
