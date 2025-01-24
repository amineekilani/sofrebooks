import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db";
import userRoutes from "./routes/userRoutes";
import bookRoutes from "./routes/bookRoutes";
import loanRoutes from "./routes/loanRoutes";


dotenv.config();
connectDB();


const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Welcome to the Books Loan Management API!");
  });

app.use("/api/users", userRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/loans", loanRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));