import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { createUser, findUserByEmail, findUserById } from "../models/userModel";
import pool from "../db";

const signup = async (req: express.Request, res: express.Response) => {
  const { fullName, email, password, role, id } = req.body;
  try {
    const existingUser = await findUserByEmail(email, role);
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }
    if (role.toLowerCase() === "student") {
      const studentId = Math.floor(Math.random() * 1000000);
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = await createUser({
        fullName,
        email,
        password: hashedPassword,
        role,
        id: String(studentId),
      });

      const compulsoryCourses = await pool.query(
        "SELECT id FROM courses WHERE compulsory = true"
      );

      for (const course of compulsoryCourses.rows) {
        await pool.query(
          "INSERT INTO student_courses (student_id, course_id) VALUES ($1, $2)",
          [studentId, course.id]
        );
      }

      res.status(201).json(newUser);
    } else if (
      role.toLowerCase() === "teacher" ||
      role.toLowerCase() === "doctor"
    ) {
      const existingId = await findUserById(id, role);
      if (existingId) {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await createUser({
          fullName,
          email,
          password: hashedPassword,
          role,
          id,
        });

        res.status(201).json(newUser);
      } else {
        return res.status(400).json({ message: "Invalid ID" });
      }
    } else if (role.toLowerCase() === "parent") {
      const existingId = await findUserById(id, "student");
      if (existingId) {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await createUser({
          fullName,
          email,
          password: hashedPassword,
          role,
          id,
        });

        res.status(201).json(newUser);
      } else {
        return res.status(400).json({ message: "Invalid student ID" });
      }
    } else if (role.toLowerCase() === "admin") {
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = await createUser({
        fullName,
        email,
        password: hashedPassword,
        role,
        id,
      });

      res.status(201).json(newUser);
    }
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

const signin = async (req: express.Request, res: express.Response) => {
  const { email, password, role } = req.body;
  try {
    const user = await findUserByEmail(email, role);
    if (!user) {
      return res
        .status(400)
        .json({ message: "Invalid email, password, or role" });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res
        .status(400)
        .json({ message: "Invalid email, password, or role" });
    }

    const token = jwt.sign({ id: user.id, role: user.role }, "secret", {
      expiresIn: "1h",
    });

    res.status(200).json({ token, user });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export { signup, signin };
