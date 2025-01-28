import mongoose from "mongoose";

const bookSchema = new mongoose.Schema(
{
    title: { type: String, required: true },
    author: { type: String, required: true },
    category: { type: String, required: true },
    isAvailable: { type: Boolean, required: true, default: true },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    borrower: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    loans: { type: [mongoose.Schema.Types.ObjectId], ref: "LoanRequest", default: [] },
},
{
    timestamps: true
}
);

export default mongoose.model("Book", bookSchema);