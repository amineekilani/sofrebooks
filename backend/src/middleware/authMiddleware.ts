import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User";

interface DecodedToken {
  id: string;
}

export interface AuthRequest extends Request {
  user?: any;
}

export const protect = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    // 1. Get the token from the cookies
    const token = req.cookies.token;
    if (!token) {
      res.status(401).json({ message: "Not authorized, no token provided" });
      return;
    }

    // 2. Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as DecodedToken;
    // 3. Find the user associated with the token
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      res.status(401).json({ message: "User not found" });
      return;
    }

    // 4. Attach the user to the request object
    req.user = user;
    next();
  } catch (error) {
    // Handle specific JWT errors
    if (error instanceof jwt.JsonWebTokenError) {
      res.status(401).json({ message: "Invalid token" });
      return;
    }
    if (error instanceof jwt.TokenExpiredError) {
      res.status(401).json({ message: "Token expired" });
      return;
    }
    // Generic error handling
    console.error("Error in protect middleware:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};