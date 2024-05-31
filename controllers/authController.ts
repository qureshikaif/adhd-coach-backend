import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { createUser, findUserByEmail, findUserById } from "../models/userModel";

const signup = async (req: express.Request, res: express.Response) => {
  const { fullName, email, password, role, id } = req.body;
  try {
    const existingUser = await findUserByEmail(email, role);
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists " });
    }
    console.log("1");
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
      const existingId = await findUserById(id, "parent");
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
  console.log(req.body);
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
