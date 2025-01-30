import { Request, Response } from "express";
import Book from "../models/Book";
import { AuthRequest } from "../middleware/authMiddleware";

export const getBooks=async(req: AuthRequest, res: Response) : Promise<any> =>
{
    try
    {
        const books=await Book.find();
        res.json(books);
    }
    catch (error)
    {
        res.status(500).json({ message: "Error fetching books" });
    }
};

export const getBooksByUser=async(req: AuthRequest, res: Response) : Promise<any> =>
{
    try
    {
        const books = await Book.find({ owner: req.user._id });
        res.json(books);
    }
    catch (error)
    {
        res.status(500).json({ message: "Error fetching books" });
    }
};

export const addBook=async(req: AuthRequest, res: Response) : Promise<any> =>
{
    const { title, author, category }=req.body;
    try
    {
        const newBook=new Book({ title, author, category, owner: req.user._id});
        await newBook.save();
        req.user.booksOwned.push(newBook._id);
        await req.user.save();
        res.status(201).json(newBook);
    } catch (error)
    {
        res.status(500).json({ message: "Error adding book" });
    }
};

export const updateBook=async(req: AuthRequest, res: Response): Promise<any> =>
{
    const { id }=req.params;
    const { title, author, category }=req.body;
    try
    {
        const book=await Book.findOneAndUpdate({ _id: id, owner: req.user._id }, { title, author, category }, { new: true });
        if (!book)
        {
            res.status(404).json({ message: "Book not found" });
            return;
        }
        res.json(book);
    }
    catch (error)
    {
        res.status(500).json({ message: "Error updating book" });
    }
};

export const deleteBook=async(req: AuthRequest, res: Response): Promise<any> =>
{
    const { id }=req.params;
    try
    {
        const book=await Book.findOneAndDelete({ _id: id, owner: req.user._id });
        if (!book)
        {
            res.status(404).json({ message: "Book not found" });
            return;
        }
        res.json({ message: "Book deleted successfully" });
    }
    catch (error)
    {
        res.status(500).json({ message: "Error deleting book" });
    }
};

export const getBookById=async(req: Request, res: Response): Promise<any> =>
{
    try
    {
        const book=await Book.findById(req.params.id).populate("owner", "name email");
        if (!book)
        {
            return res.status(404).json({ message: "Book not found" });
        }
        res.json(book);
    }
    catch (error)
    {
        res.status(500).json({ message: "Error fetching book" });
    }
};