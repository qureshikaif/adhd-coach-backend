import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { createUser, findUserByEmail } from "../models/userModel.js";

const signup = async (req: express.Request, res: express.Response) => {
  const { fullName, email, password, role } = req.body;

  try {
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await createUser({
      fullName,
      email,
      password: hashedPassword,
      role,
    });

    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

const signin = async (req: express.Request, res: express.Response) => {
  const { email, password, role } = req.body;

  try {
    const user = await findUserByEmail(email);
    if (!user || user.role !== role) {
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
