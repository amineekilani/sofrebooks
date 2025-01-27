import { Request, Response } from "express";
import Book from "../models/Book";
import { AuthRequest } from "../middleware/authMiddleware";

export const getBooks = async (req: AuthRequest, res: Response) : Promise<any> => {
  try {
    const books = await Book.find({ owner: req.user._id });
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: "Error fetching books" });
  }
};

export const addBook = async (req: AuthRequest, res: Response) : Promise<any> => {
  const { title, author, category } = req.body;
  try {
    const newBook = new Book({
      title,
      author,
      category,
      owner: req.user._id,
    });
    await newBook.save();
    res.status(201).json(newBook);
  } catch (error) {
    res.status(500).json({ message: "Error adding book" });
  }
};

export const updateBook = async (req: AuthRequest, res: Response): Promise<any> => {
  const { id } = req.params;
  const { title, author } = req.body;
  try {
    const book = await Book.findOneAndUpdate(
      { _id: id, owner: req.user._id },
      { title, author },
      { new: true }
    );
    
    if (!book) {
      res.status(404).json({ message: "Book not found" });
      return; // Utilisez return sans valeur après avoir envoyé la réponse
    }
    
    res.json(book);
  } catch (error) {
    res.status(500).json({ message: "Error updating book" });
  }
};

export const deleteBook = async (req: AuthRequest, res: Response): Promise<any> => {
  const { id } = req.params;
  try {
    const book = await Book.findOneAndDelete({ _id: id, owner: req.user._id });
    
    if (!book) {
      res.status(404).json({ message: "Book not found" });
      return;
    }
    
    res.json({ message: "Book deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting book" });
  }
};
