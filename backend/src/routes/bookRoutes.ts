import express from "express";
import { getBooks, addBook, updateBook, deleteBook, getBooksByUser, getBookById } from "../controllers/bookController";
import { protect } from "../middleware/authMiddleware";

const router=express.Router();

router.get("/", getBooks);
router.get("/user", protect, getBooksByUser);
router.get("/:id", getBookById);
router.post("/", protect, addBook);
router.put("/:id", protect, updateBook);
router.delete("/:id", protect, deleteBook);

export default router;