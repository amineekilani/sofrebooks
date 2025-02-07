import { Request, Response } from "express";
import LoanRequest from "../models/LoanRequest";
import Book from "../models/Book";
import { AuthRequest } from "../middleware/authMiddleware";
import mongoose from "mongoose";

export const requestLoan=async(req: AuthRequest, res: Response): Promise<any> =>
{
    try
    {
        const { bookId }=req.body;
        const userId=req.user._id;
        const book=await Book.findById(bookId).populate("owner");
        if (!book)
        {
            return res.status(404).json({ message: "Book not found" });
        }
        if (book.owner._id.toString()===userId.toString())
        {
            return res.status(400).json({ message: "You cannot request your own book" });
        }
        const existingRequest=await LoanRequest.findOne({ book: bookId, borrower: userId });
        if (existingRequest)
        {
            return res.status(400).json({ message: "Loan request already sent" });
        }
        const loanRequest=new LoanRequest({ book: bookId, borrower: userId, status: "pending" });
        await loanRequest.save();
        res.status(201).json({ message: "Loan request sent successfully" });
    }
    catch (error)
    {
        console.error("Error requesting loan:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const getLoanRequestsForOwner=async(req: AuthRequest, res: Response)=>
{
    try
    {
        const ownerId=req.user._id;
        const loanRequests=await LoanRequest.find().populate({ path: "book", match: { owner: ownerId }}).populate("borrower", "name");
        res.json(loanRequests.filter((req)=>req.book!==null));
    }
    catch (error)
    {
        console.error("Error fetching loan requests:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const getLoanRequestsForBorrower=async(req: AuthRequest, res: Response)=>
{
    try
    {
        const borrowerId=req.user._id;
        const loanRequests=await LoanRequest.find({ borrower: borrowerId }).populate("book", "title author").then(requests=>requests.filter(req=>req.book!==null));
        res.json(loanRequests);
    }
    catch (error)
    {
        console.error("Error fetching loan requests:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const acceptLoanRequest=async(req: AuthRequest, res: Response): Promise<any> =>
{
    try
    {
        const { requestId }=req.params;
        const loanRequest=await LoanRequest.findById(requestId);
        if (!loanRequest)
        {
            return res.status(404).json({ message: "Loan request not found" });
        }
        loanRequest.status="approved";
        const book=await Book.findById(loanRequest.book);
        if (!book)
        {
            return res.status(404).json({ message: "Book not found" });
        }
        book.isAvailable=false;
        book.borrower=loanRequest.borrower;
        await book.save();
        await loanRequest.save();
        res.json({ message: "Loan request accepted" });
    }
    catch (error)
    {
        console.error("Error accepting loan request:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const declineLoanRequest=async(req: AuthRequest, res: Response): Promise<any> =>
{
    try
    {
        const { requestId }=req.params;
        const loanRequest=await LoanRequest.findById(requestId);
        if (!loanRequest)
        {
            return res.status(404).json({ message: "Loan request not found" });
        }
        loanRequest.status = "rejected";
        await loanRequest.save();
        res.json({ message: "Loan request rejected" });
    }
    catch (error)
    {
        console.error("Error rejecting loan request:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const returnBook=async(req: AuthRequest, res: Response): Promise<any> =>
{
    try
    {
        const { requestId }=req.params;
        const { feedback }=req.body;
        if (!["like", "dislike", "neutral"].includes(feedback))
        {
            return res.status(400).json({ message: "Invalid feedback value" });
        }
        const loanRequest=await LoanRequest.findById(requestId);
        if (!loanRequest)
        {
            return res.status(404).json({ message: "Loan request not found" });
        }
        if (loanRequest.borrower.toString()!==req.user._id.toString())
        {
            return res.status(403).json({ message: "You are not authorized to return this book" });
        }
        const book=await Book.findById(loanRequest.book);
        if (!book)
        {
            return res.status(404).json({ message: "Book not found" });
        }
        if (feedback==="like")
        {
            book.likes++;
        }
        else if (feedback==="dislike")
        {
            book.dislikes++;
        }
        else if (feedback==="neutral")
        {
            book.neutral++;
        }
        book.isAvailable=true;
        book.borrower=undefined as unknown as mongoose.Types.ObjectId;
        await book.save();
        loanRequest.status="returned";
        await loanRequest.save();
        res.json({ message: "Book returned successfully" });
    }
    catch (error)
    {
        console.error("Error returning book:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};