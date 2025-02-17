import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import User from "../models/User";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

interface TokenPayload
{
    id: string;
    type: "access" | "refresh";
}

const generateAccessToken=(id: string)=>
{
    return jwt.sign({ id, type: "access" }, process.env.JWT_ACCESS_SECRET!, { expiresIn: "15m" });
};

const generateRefreshToken=(id: string)=>
{
    return jwt.sign({ id, type: "refresh" }, process.env.JWT_REFRESH_SECRET!, { expiresIn: "7d" });
};

const setTokenCookies=(res: Response, accessToken: string, refreshToken: string)=>
{
    res.cookie("accessToken", accessToken, { httpOnly: true, secure: process.env.NODE_ENV==="production", sameSite: "strict", maxAge: 15*60*1000});
    res.cookie("refreshToken", refreshToken, { httpOnly: true, secure: process.env.NODE_ENV==="production", sameSite: "strict", maxAge: 7*24*60*60*1000});
};

export const registerUser=asyncHandler(async(req: Request, res: Response)=>
{
    const { name, email, password }=req.body;
    if (!name || !email || !password)
    {
        throw new Error("Please add all fields");
    }    
    const userExists=await User.findOne({ email });
    if (userExists)
    {
        throw new Error("User already exists");
    }
    const salt=await bcrypt.genSalt(10);
    const hashedPassword=await bcrypt.hash(password, salt);
    const user=await User.create({ name, email, password: hashedPassword });
    if (user)
    {
        const accessToken=generateAccessToken(user.id);
        const refreshToken=generateRefreshToken(user.id);
        setTokenCookies(res, accessToken, refreshToken);
        res.status(201).json({ _id: user.id, name: user.name, email: user.email });
    }
    else
    {
        res.status(400);
        throw new Error("Invalid user data");
    }
});

export const loginUser=asyncHandler(async(req: Request, res: Response)=>
{
    const { email, password }=req.body;
    const user=await User.findOne({ email });
    if (!user)
    {
        throw new Error("User not found");
    }
    const isMatch=await bcrypt.compare(password, user.password);
    if (!isMatch)
    {
        throw new Error("Invalid credentials");
    }
    const accessToken=generateAccessToken(user.id);
    const refreshToken=generateRefreshToken(user.id);
    setTokenCookies(res, accessToken, refreshToken);
    res.json({ _id: user.id, name: user.name, email: user.email });
});

export const refreshToken=asyncHandler(async(req: Request, res: Response)=>
{
    const refreshToken=req.cookies.refreshToken;
    if (!refreshToken)
    {
        res.status(401);
        throw new Error("No refresh token");
    }
    try
    {
        const decoded=jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET!) as TokenPayload;
        if (decoded.type!=="refresh")
        {
            throw new Error("Invalid token type");
        }
        const user=await User.findById(decoded.id);
        if (!user)
        {
            throw new Error("User not found");
        }
        const newAccessToken=generateAccessToken(user.id);
        res.cookie("accessToken", newAccessToken, { httpOnly: true, secure: process.env.NODE_ENV==="production", sameSite: "strict", maxAge: 15*60*1000});
        res.json({ message: "Access token refreshed" });
    }
    catch (error)
    {
        res.status(401);
        throw new Error("Invalid refresh token");
    }
});

export const logoutUser=(req: Request, res: Response)=>
{
    res.cookie("accessToken", "", { maxAge: 0 });
    res.cookie("refreshToken", "", { maxAge: 0 });
    res.json({ message: "Logged out successfully" });
};