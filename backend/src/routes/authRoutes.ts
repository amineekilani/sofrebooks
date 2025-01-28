import express from "express";
import { registerUser, loginUser, logoutUser, refreshToken } from "../controllers/authController";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.post("/refresh", refreshToken);  // Route to refresh access token

export default router;