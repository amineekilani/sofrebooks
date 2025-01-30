import { useEffect, useState, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getBookById, requestLoan } from "../services/BookService";
import Navbar from "../components/Navbar";
import { AuthContext } from "../context/AuthContext";

function BookPage() {
  const { id } = useParams();
  const { user } = useContext(AuthContext)!;
  const navigate = useNavigate();
  const [book, setBook] = useState<any>(null);
  const [requested, setRequested] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) {
      navigate("/");
    }
  }, [user, navigate]);

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

  const handleRequest = async () => {
    try {
      await requestLoan(book._id);
      setRequested(true);
    } catch (error) {
      setError("Loan request already sent or an error occurred.");
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <Navbar />

      {/* Main Content */}
      <main className="flex-1 p-6 bg-gray-50">
        <h1 className="text-4xl font-bold mb-4">{book.title}</h1>
        <p className="text-xl"><strong>Author:</strong> {book.author}</p>
        <p className="text-xl"><strong>Category:</strong> {book.category}</p>
        <p className="text-xl"><strong>Owner:</strong> {book.owner?.name || "Unknown"}</p>
        <p className="text-xl"><strong>Status:</strong> {book.isAvailable ? "Available" : "Loaned"}</p>
        {error && <p className="text-red-500">{error}</p>}
        <div className="mt-4">
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            disabled={!book.isAvailable || isOwner}
            onClick={handleRequest}
          >
            {requested ? "Request Sent" : "Request"}
          </button>
        </div>
      </main>
    </div>
  );
}

export default BookPage;