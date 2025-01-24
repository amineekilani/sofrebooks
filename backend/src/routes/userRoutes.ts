import express from "express";
import User from "../models/User";
import asyncHandler from "express-async-handler";

const router = express.Router();

//  Ajouter un utilisateur
router.post(
  "/",
  asyncHandler(async (req, res) => {
    const { name, email } = req.body;
    const user = new User({ name, email });
    await user.save();
    res.status(201).json(user);
  })
);

//  Obtenir tous les utilisateurs
router.get(
  "/",
  asyncHandler(async (req, res) => {
    const users = await User.find();
    res.json(users);
  })
);

export default router;
