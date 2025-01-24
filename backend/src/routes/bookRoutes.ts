import express from "express";
import Book from "../models/Book";
import asyncHandler from "express-async-handler";

const router = express.Router();

//  Ajouter un livre
router.post(
  "/",
  asyncHandler(async (req, res) => {
    const { title, author, owner } = req.body;
    const book = new Book({ title, author, owner });
    await book.save();
    res.status(201).json(book);
  })
);

//  Obtenir tous les livres
router.get(
  "/",
  asyncHandler(async (req, res) => {
    const books = await Book.find().populate("owner", "name email");
    res.json(books);
  })
);

export default router;
