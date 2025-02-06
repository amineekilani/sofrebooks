import mongoose from "mongoose";

export enum BookCategory
{
    Fiction="Fiction",
    NonFiction="Non-Fiction",
    Educational="Educational & Academic",
    Children="Children's & Young Adult",
    Comics="Comics & Graphic Novels",
    Religious="Religious & Spiritual",
    Science="Science & Technology",
    Business="Business & Economics",
    SelfHelp="Self-Help & Personal Development",
    Lifestyle="Hobbies & Lifestyle"
}

const bookSchema=new mongoose.Schema
(
    {
        title: { type: String, required: true },
        author: { type: String, required: true },
        category: { type: String, enum: Object.values(BookCategory), required: true },
        isbn: { type: String, required: true },
        publisher: { type: String, required: true },
        publicationYear: { type: Number, required: true },
        isAvailable: { type: Boolean, required: true, default: true },
        owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        borrower: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
        loans: { type: [mongoose.Schema.Types.ObjectId], ref: "LoanRequest", default: [] }
    },
    {
        timestamps: true
    }
);

export default mongoose.model("Book", bookSchema);