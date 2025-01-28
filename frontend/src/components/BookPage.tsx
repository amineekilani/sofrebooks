import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { getBookById } from "../services/BookService";
import Navbar from "../components/Navbar";
import { AuthContext } from "../context/AuthContext";

function BookPage() {
  const { id } = useParams();
  const { user } = useContext(AuthContext)!;
  const [book, setBook] = useState<any>(null);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const data = await getBookById(id!);
        setBook(data);
      } catch (error) {
        console.error("Error fetching book details:", error);
      }
    };
    fetchBook();
  }, [id]);

  if (!book) return <p>Loading...</p>;

  const isOwner = user?._id === book.owner?._id; // Check if logged-in user is the owner

  return (
    <div>
      <Navbar />
      <h1>{book.title}</h1>
      <p><strong>Author:</strong> {book.author}</p>
      <p><strong>Category:</strong> {book.category}</p>
      <p><strong>Owner:</strong> {book.owner.name}</p>
      <p><strong>Status:</strong> {book.isAvailable ? "Available" : "Loaned"}</p>
      <p>
        <button disabled={!book.isAvailable || isOwner}>Request</button>
      </p>
    </div>
  );
}

export default BookPage;