import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { getBooks } from "../services/BookService";
import { getLoanRequests } from "../services/BookService";
import api from "../services/api"; // Import API instance

function Home() {
  const { user } = useContext(AuthContext)!;
  const navigate = useNavigate();
  const [books, setBooks] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchTriggered, setSearchTriggered] = useState(false);
  const [loanRequests, setLoanRequests] = useState<any[]>([]);

  useEffect(() => {
    if (!user) {
      navigate("/");
    }
  }, [user, navigate]);

  useEffect(() => {
    const fetchLoanRequests = async () => {
      try {
        const data = await getLoanRequests();
        setLoanRequests(data);
      } catch (error) {
        console.error("Error fetching loan requests:", error);
      }
    };
    fetchLoanRequests();
  }, []);

  const fetchBooks = async () => {
    try {
      const data = await getBooks();
      setBooks(data);
    } catch (error) {
      console.error("Error fetching books:", error);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    if (!searchTriggered) {
      setSearchTriggered(true);
      fetchBooks();
    }
  };

  const handleAccept = async (requestId: string) => {
    try {
      await api.put(`/loans/accept/${requestId}`, {}, { withCredentials: true });
      setLoanRequests((prev) =>
        prev.map((req) => (req._id === requestId ? { ...req, status: "approved" } : req))
      );
    } catch (error) {
      console.error("Error accepting loan request:", error);
    }
  };

  const handleDecline = async (requestId: string) => {
    try {
      await api.put(`/loans/decline/${requestId}`, {}, { withCredentials: true });
      setLoanRequests((prev) =>
        prev.map((req) => (req._id === requestId ? { ...req, status: "rejected" } : req))
      );
    } catch (error) {
      console.error("Error declining loan request:", error);
    }
  };

  const filteredBooks = books.filter(
    (book) =>
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <Navbar />
      <h1>Welcome to SofreBooks</h1>
      <input
        type="search"
        placeholder="Search for books"
        value={searchTerm}
        onChange={handleSearch}
      />
      {searchTriggered && searchTerm && (
        <ul>
          {filteredBooks.length > 0 ? (
            filteredBooks.map((book) => (
              <li key={book._id}>
                <Link to={`/books/${book._id}`}>
                  {book.title} by {book.author} ({book.category})
                </Link>
              </li>
            ))
          ) : (
            <p>No books found</p>
          )}
        </ul>
      )}
      {loanRequests.length > 0 && (
        <div>
          <h3>Loan Requests</h3>
          <ul>
            {loanRequests.map((req) => (
              <li key={req._id}>
                {req.borrower.name} requested <strong>{req.book.title}</strong>{" "}
                <em>({req.status === "pending" ? "pending" : req.status === "approved" ? "approved" : "rejected"})</em>
                {req.status === "pending" && (
                  <>
                    <button onClick={() => handleAccept(req._id)}>Accept</button>
                    <button onClick={() => handleDecline(req._id)}>Decline</button>
                  </>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default Home;
