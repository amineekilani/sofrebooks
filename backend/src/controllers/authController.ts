import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import User from "../models/User";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

// Generate JWT
const generateToken = (id: string) => {
  return jwt.sign({ id }, process.env.JWT_SECRET!, { expiresIn: "7d" });
};

// Register User
export const registerUser = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, password } = req.body;
  
  if (!name || !email || !password) throw new Error("Please add all fields");

  const userExists = await User.findOne({ email });
  if (userExists) throw new Error("User already exists");

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await User.create({ name, email, password: hashedPassword });

  if (user) {
    res.cookie("token", generateToken(user.id), { httpOnly: true });
    res.json({ _id: user.id, name: user.name, email: user.email });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

// Login User
export const loginUser = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  
  const user = await User.findOne({ email });
  if (!user) throw new Error("User not found");

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error("Invalid credentials");

  res.cookie("token", generateToken(user.id), { httpOnly: true });
  res.json({ _id: user.id, name: user.name, email: user.email });
});

// Logout User
export const logoutUser = (req: Request, res: Response) => {
  res.clearCookie("token");
  res.json({ message: "Logged out" });
};