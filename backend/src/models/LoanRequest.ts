import mongoose from "mongoose";

const loanRequestSchema = new mongoose.Schema(
  {
    book: { type: mongoose.Schema.Types.ObjectId, ref: "Book", required: true },
    borrower: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    status: { type: String, enum: ["pending", "approved", "rejected", "returned"], required: true, default: "pending"}
  },
  { timestamps: true }
);

export default mongoose.model("LoanRequest", loanRequestSchema);