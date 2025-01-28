import { Request, Response } from "express";
import LoanRequest from "../models/LoanRequest";
import Book from "../models/Book";
import { AuthRequest } from "../middleware/authMiddleware";


export const requestLoan = async (req: AuthRequest, res: Response) : Promise<any> => {
  try {
    const { bookId } = req.body;
    const userId = req.user._id; // Borrower (logged-in user)

    const book = await Book.findById(bookId).populate("owner");
    if (!book) return res.status(404).json({ message: "Book not found" });

    if (book.owner._id.toString() === userId.toString()) {
      return res.status(400).json({ message: "You cannot request your own book" });
    }

    // Check if a request already exists
    const existingRequest = await LoanRequest.findOne({ book: bookId, borrower: userId });
    if (existingRequest) return res.status(400).json({ message: "Loan request already sent" });

    const loanRequest = new LoanRequest({
      book: bookId,
      borrower: userId,
      status: "pending",
    });

    await loanRequest.save();
    res.status(201).json({ message: "Loan request sent successfully" });

  } catch (error) {
    res.status(500).json({ message: "Error requesting loan" });
  }
};

export const getLoanRequestsForOwner = async (req: AuthRequest, res: Response) => {
  try {
    const ownerId = req.user._id;
    const loanRequests = await LoanRequest.find()
      .populate({
        path: "book",
        match: { owner: ownerId },
      })
      .populate("borrower", "name");

    res.json(loanRequests.filter((req) => req.book !== null)); // Remove requests not for the owner
  } catch (error) {
    res.status(500).json({ message: "Error fetching loan requests" });
  }
};

// Accept a loan request
export const acceptLoanRequest = async (req: AuthRequest, res: Response) : Promise<any> => {
    try {
      const { requestId } = req.params;
  
      // Find the loan request by ID
      const loanRequest = await LoanRequest.findById(requestId);
      if (!loanRequest) return res.status(404).json({ message: "Loan request not found" });
  
      // Only the owner can accept or reject requests
      /*if (loanRequest.book.owner.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: "You are not authorized to accept this request" });
      }*/
  
      // Update the loan request status to 'approved'
      loanRequest.status = "approved";
      await loanRequest.save();
  
      res.json({ message: "Loan request approved" });
    } catch (error) {
      res.status(500).json({ message: "Error accepting loan request" });
    }
  };
  
  // Decline a loan request
  export const declineLoanRequest = async (req: AuthRequest, res: Response) : Promise<any> => {
    try {
      const { requestId } = req.params;
  
      // Find the loan request by ID
      const loanRequest = await LoanRequest.findById(requestId);
      if (!loanRequest) return res.status(404).json({ message: "Loan request not found" });
  
      // Only the owner can accept or reject requests
      /*if (loanRequest.book.owner._id.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: "You are not authorized to decline this request" });
      }*/
  
      // Update the loan request status to 'rejected'
      loanRequest.status = "rejected";
      await loanRequest.save();
  
      res.json({ message: "Loan request rejected" });
    } catch (error) {
      res.status(500).json({ message: "Error rejecting loan request" });
    }
  };