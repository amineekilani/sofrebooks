import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User";

interface DecodedToken {
  id: string;
  type: 'access' | 'refresh';
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
    const accessToken = req.cookies.accessToken;
    
    if (!accessToken) {
      res.status(401).json({ message: "Access token required" });
      return;
    }

    const decoded = jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET!) as DecodedToken;
    
    if (decoded.type !== 'access') {
      throw new Error('Invalid token type');
    }

    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      res.status(401).json({ message: "User not found" });
      return;
    }

    req.user = user;
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      res.status(401).json({ 
        message: "Token expired",
        isExpired: true
      });
      return;
    }
    
    res.status(401).json({ message: "Not authorized" });
  }
};