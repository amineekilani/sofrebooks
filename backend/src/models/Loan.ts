import mongoose from "mongoose";

const loanSchema = new mongoose.Schema({
  book: { type: mongoose.Schema.Types.ObjectId, ref: "Book", required: true },
  borrower: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  status: { type: String, enum: ["pending", "accepted", "rejected"], default: "pending" },
});

export default mongoose.model("Loan", loanSchema);