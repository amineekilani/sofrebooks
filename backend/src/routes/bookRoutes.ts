import express from "express";
import { Request, Response, NextFunction } from "express";
import Book from "../models/Book";
import asyncHandler from "express-async-handler";
import { authenticate } from "../middleware/auth"; // Import middleware

const router = express.Router();

//add
router.post(
  "/",
  authenticate,
  async (req: Request, res: Response) => {
    const { title, author } = req.body;

    if (!req.userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const book = new Book({ title, author, owner: req.userId });
    await book.save();
    res.status(201).json(book);
  }
);

//  Obtenir tous les livres
router.get(
  "/",
  asyncHandler(async (req, res) => {
    const books = await Book.find().populate("owner", "name email");
    res.json(books);
  })
);

// Fetch a single book by ID
router.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const book = await Book.findById(req.params.id).populate("owner", "name email");
    if (book) {
      res.json(book);
    } else {
      res.status(404).json({ message: "Book not found" });
    }
  })
);

export default router;
