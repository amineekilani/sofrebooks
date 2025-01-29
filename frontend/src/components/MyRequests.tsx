import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { getLoanRequestsForBorrower } from "../services/BookService";
import api from "../services/api";
import Navbar from "./Navbar";
import { useNavigate } from "react-router-dom";

function MyRequests() {
  const { user } = useContext(AuthContext)!;
  const navigate = useNavigate();
  
  const [borrowerLoanRequests, setBorrowerLoanRequests] = useState<any[]>([]);

  useEffect(() => {
      if (!user) {
        navigate("/");
      }
    }, [user, navigate]);

  useEffect(() => {
    const fetchLoanRequests = async () => {
      try {
        const borrowerRequests = await getLoanRequestsForBorrower();
        setBorrowerLoanRequests(borrowerRequests);
      } catch (error) {
        console.error("Error fetching loan requests:", error);
      }
    };
    fetchLoanRequests();
  }, []);

  const handleReturnBook = async (requestId: string) => {
    try {
      await api.put(`/loans/return/${requestId}`, {}, { withCredentials: true });
      setBorrowerLoanRequests((prev) =>
        prev.map((req) => (req._id === requestId ? { ...req, status: "returned" } : req))
      );
    } catch (error) {
      console.error("Error returning book:", error);
    }
  };

  return (
    <div>
        <Navbar />
      <h3>Your Loan Requests</h3>
      <ul>
        {borrowerLoanRequests.length > 0 ? (
          borrowerLoanRequests.map((req) => (
            <li key={req._id}>
              You requested <strong>{req.book.title}</strong>
              <em>({req.status})</em>
              {req.status === "approved" && (
                <button onClick={() => handleReturnBook(req._id)}>Return Book</button>
              )}
            </li>
          ))
        ) : (
          <p>No loan requests found</p>
        )}
      </ul>
    </div>
  );
}

export default MyRequests;
