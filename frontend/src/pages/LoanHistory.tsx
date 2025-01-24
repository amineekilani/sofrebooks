import React, { useState, useEffect } from 'react';
import api from '../services/api';

const LoanHistory = ({ userId }: { userId: string }) => {
  const [loans, setLoans] = useState<any[]>([]);

  useEffect(() => {
    const fetchLoanHistory = async () => {
      try {
        const response = await api.get(`/loans/${userId}`);
        setLoans(response.data);
      } catch (error) {
        console.error("Error fetching loan history", error);
      }
    };

    fetchLoanHistory();
  }, [userId]);

  return (
    <div>
      <h1>Your Loan History</h1>
      {loans.length === 0 ? (
        <p>You have no loan history.</p>
      ) : (
        <ul>
          {loans.map((loan) => (
            <li key={loan._id}>
              <p>Book: {loan.book.title}</p>
              <p>Status: {loan.status}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default LoanHistory;
