import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import LoanRequest from '../components/LoanRequest';

const BookPage = () => {
  const { id } = useParams();
  const [book, setBook] = useState<any | null>(null);
  const [isLoaned, setIsLoaned] = useState(false);  // Track loan status

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const response = await api.get(`/books/${id}`);
        setBook(response.data);
        // Check if the book is loaned out by looking for loans with pending/accepted status
        const loanResponse = await api.get(`/loans/${id}`);
        setIsLoaned(loanResponse.data.some((loan: any) => loan.status !== "rejected"));
      } catch (error) {
        console.error("Error fetching book details", error);
      }
    };

    fetchBook();
  }, [id]);

  return (
    <div>
      {book ? (
        <>
          <h1>{book.title}</h1>
          <p>Author: {book.author}</p>
          <p>{book.description}</p>
          {isLoaned ? (
            <p>This book is currently loaned out.</p>
          ) : (
            <LoanRequest bookId={book._id} userId="currentUserId" />
          )}
        </>
      ) : (
        <p>Loading book details...</p>
      )}
    </div>
  );
};

export default BookPage;