import mongoose, { Document } from "mongoose";

interface IBook extends Document {
  title: string;
  author: string;
  owner: mongoose.Schema.Types.ObjectId;
}

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
});

const Book = mongoose.model<IBook>("Book", bookSchema);
export default Book;