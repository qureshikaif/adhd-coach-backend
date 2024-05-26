import pool from "../db";
import { UserType } from "../types/userType";

export const createUser = async (user: UserType) => {
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

export const findUserById = async (id: string) => {
  const result = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
  return result.rows[0];
};
