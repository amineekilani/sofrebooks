import React, { useState } from 'react';
import api from '../services/api';

const LoanRequest = ({ bookId, userId }: { bookId: string, userId: string }) => {
  const [message, setMessage] = useState('');

  const handleRequest = async () => {
    try {
      await api.post('/loans', { book: bookId, borrower: userId, owner: 'owner_id' });
      setMessage('Loan request sent!');
    } catch (error) {
      setMessage('Error sending loan request.');
    }
  };

  return (
    <div>
      <button onClick={handleRequest}>Request Loan</button>
      {message && <p>{message}</p>}
    </div>
  );
};

export default LoanRequest;
