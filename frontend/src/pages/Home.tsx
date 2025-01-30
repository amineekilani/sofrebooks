import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { getBooks, getLoanRequestsForOwner, getLoanRequestsForBorrower } from "../services/BookService";
import api from "../services/api"; // Import API instance

function Home() {
  const { user } = useContext(AuthContext)!;
  const navigate = useNavigate();
  const [books, setBooks] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchTriggered, setSearchTriggered] = useState(false);
  const [ownerLoanRequests, setOwnerLoanRequests] = useState<any[]>([]);
  const [borrowerLoanRequests, setBorrowerLoanRequests] = useState<any[]>([]);

  useEffect(() => {
    if (!user) {
      navigate("/");
    }
  }, [user, navigate]);

  useEffect(() => {
    const fetchLoanRequests = async () => {
      try {
        const ownerRequests = await getLoanRequestsForOwner();
        const borrowerRequests = await getLoanRequestsForBorrower();
        setOwnerLoanRequests(ownerRequests);
        setBorrowerLoanRequests(borrowerRequests);
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
      setOwnerLoanRequests((prev) =>
        prev.map((req) => (req._id === requestId ? { ...req, status: "approved" } : req))
      );
    } catch (error) {
      console.error("Error accepting loan request:", error);
    }
  };

  const handleDecline = async (requestId: string) => {
    try {
      await api.put(`/loans/decline/${requestId}`, {}, { withCredentials: true });
      setOwnerLoanRequests((prev) =>
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
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <Navbar />

      {/* Main Content */}
      <main className="flex-1 p-6 bg-gray-50">
        <h1 className="text-3xl font-bold mb-8">Welcome to SofreBooks</h1>
        <input
          type="search"
          placeholder="Search for books"
          value={searchTerm}
          onChange={handleSearch}
          className="p-3 w-full mb-6 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
        
        {searchTriggered && searchTerm && (
          <ul>
            {filteredBooks.length > 0 ? (
              filteredBooks.map((book) => (
                <li key={book._id}>
                  <Link to={`/books/${book._id}`} className="text-orange-600 hover:text-orange-500">
                    {book.title} by {book.author} ({book.category})
                  </Link>
                </li>
              ))
            ) : (
              <p>No books found</p>
            )}
          </ul>
        )}

        {ownerLoanRequests.length > 0 && (
          <div>
            <h3 className="text-2xl font-semibold mb-4">Loan Requests for Your Books</h3>
            <ul>
              {ownerLoanRequests.map((req) => (
                <li key={req._id} className="mb-4">
                  {req.borrower.name} requested <strong>{req.book.title}</strong>{" "}
                  <em>({req.status})</em>
                  {req.status === "pending" && (
                    <div className="mt-2">
                      <button
                        onClick={() => handleAccept(req._id)}
                        className="mr-4 bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => handleDecline(req._id)}
                        className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600"
                      >
                        Decline
                      </button>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
      </main>
    </div>
  );
}

export default Home;
