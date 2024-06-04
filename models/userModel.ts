import pool from "../db";
import { UserType } from "../types/userType";

export const createUser = async (user: UserType) => {
  const { fullName, email, password, role, id } = user;
  if (role.toLowerCase() === "teacher" || role.toLowerCase() === "doctor") {
    if (id) {
      const result = await pool.query(
        `UPDATE ${role.toLowerCase()}s SET full_name = $1, email = $2, password = $3 WHERE id_assigned = $4 RETURNING *`,
        [fullName, email, password, id]
      );
      return result.rows[0];
    }
  } else if (role.toLowerCase() === "parent") {
    if (id) {
      const result = await pool.query(
        `INSERT INTO ${role.toLowerCase()}s (full_name, email, password, child_id) VALUES ($1, $2, $3, $4) RETURNING *`,
        [fullName, email, password, id]
      );
      return result.rows[0];
    }
  } else if (role.toLowerCase() === "student") {
    if (id) {
      const result = await pool.query(
        `INSERT INTO ${role.toLowerCase()}s (full_name, email, password, id_assigned) VALUES ($1, $2, $3, $4) RETURNING *`,
        [fullName, email, password, id]
      );
      return result.rows[0];
    }
  } else {
    const result = await pool.query(
      `INSERT INTO ${role.toLowerCase()}s (full_name, email, password) VALUES ($1, $2, $3) RETURNING *`,
      [fullName, email, password]
    );
    return result.rows[0];
  }
};

// export const createUser = async (user: UserType) => {
//   const { fullName, email, password, role, id } = user;
//   if (
//     role.toLowerCase() === "teacher" ||
//     role.toLowerCase() === "doctor" ||
//     role.toLowerCase() === "student"
//   ) {
//     if (id) {
//       const result = await pool.query(
//         `UPDATE ${role.toLowerCase()}s SET full_name = $1, email = $2, password = $3 WHERE id_assigned = $4 RETURNING *`,
//         [fullName, email, password, id]
//       );
//       return result.rows[0];
//     }
//   } else {
//     const result = await pool.query(
//       `INSERT INTO ${role.toLowerCase()}s (full_name, email, password) VALUES ($1, $2, $3) RETURNING *`,
//       [fullName, email, password]
//     );
//     return result.rows[0];
//   }
// };

export const findUserByEmail = async (email: string, role: string) => {
  const result = await pool.query(
    `SELECT * FROM ${role.toLowerCase()}s WHERE email = $1`,
    [email]
  );
  return result.rows[0];
};

export const findUserById = async (id: string, role?: string) => {
  if (!role) {
    return null;
  }
  console.log(role, id);
  if (role.toLowerCase() === "teacher" || role.toLowerCase() === "doctor") {
    const result = await pool.query(
      `SELECT * FROM ${role.toLowerCase()}s WHERE id_assigned = $1`,
      [id]
    );
    return result.rows[0];
  } else if (role.toLowerCase() === "parent") {
    console.log("eslefi");
    const result = await pool.query(
      `SELECT * FROM students WHERE id_assigned = $1`,
      [id]
    );
    return result.rows[0];
  }
};

// export const findUserByEmail = async (
//   email: string,
//   role: string,
//   id?: string
// ) => {
//   console.log(email, role, id);

//   if (role.toLowerCase() === "teacher" || role.toLowerCase() === "doctor") {
//     if (id) {
//       console.log("IF BLOCK");
//       const result = await pool.query(
//         `SELECT * FROM ${role.toLowerCase()}s WHERE email = $1 AND id_assigned = $2`,
//         [email, id]
//       );
//       return result.rows[0];
//     } else {
//       throw new Error("ID NOT FOUND");
//     }
//   } else {
//     console.log("ELSE BLOCK");
//     const result = await pool.query(
//       `SELECT * FROM ${role.toLowerCase()}s WHERE email = $1`,
//       [email]
//     );
//     return result.rows[0];
//   }
// };
