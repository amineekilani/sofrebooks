import mongoose from "mongoose";

export enum BookCategory
{
    Fiction="Fiction",
    NonFiction="Non-fiction",
    Educational="Éducatif et académique",
    Children="Enfants et jeunes adultes",
    Comics="Bandes dessinées et romans graphiques",
    Religious="Religieux et spirituel",
    Science="Sciences et technologies",
    Business="Affaires et économie",
    SelfHelp="Développement personnel et autonomie",
    Lifestyle="Loisirs et style de vie"
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
        loans: { type: [mongoose.Schema.Types.ObjectId], ref: "LoanRequest", default: [] },
        likes: { type: Number, required: true, default: 0 },
        neutral: { type: Number, required: true, default: 0 },
        dislikes: { type: Number, required: true, default: 0 },
        owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        borrower: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    },
    {
        timestamps: true
    }
);

export default mongoose.model("Book", bookSchema);