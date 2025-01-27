import React, { useEffect, useState } from "react";
import { getBooks, addBook, updateBook, deleteBook } from "../services/BookService";

const MyBooks = () => {
  const [books, setBooks] = useState([]);
  const [newBook, setNewBook] = useState({ title: "", author: "", category: "" });

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const data = await getBooks();
      setBooks(data);
    } catch (error) {
      console.error("Error fetching books", error);
    }
  };

  const handleAddBook = async () => {
    if (!newBook.title || !newBook.author || !newBook.category) return;
    try {
      await addBook(newBook);
      setNewBook({ title: "", author: "", category: "" });
      fetchBooks();
    } catch (error) {
      console.error("Error adding book", error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteBook(id);
      fetchBooks();
    } catch (error) {
      console.error("Error deleting book", error);
    }
  };

  return (
    <div>
      <h1>My Books</h1>
      <div>
        <input
          type="text"
          placeholder="Title"
          value={newBook.title}
          onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
        />
        <input
          type="text"
          placeholder="Author"
          value={newBook.author}
          onChange={(e) => setNewBook({ ...newBook, author: e.target.value })}
        />
        <input
          type="text"
          placeholder="Category"
          value={newBook.category}
          onChange={(e) => setNewBook({ ...newBook, category: e.target.value })}
        />
        <button onClick={handleAddBook}>Add Book</button>
      </div>

      <ul>
        {books.map((book: any) => (
          <li key={book._id}>
            {book.title} - {book.author} - {book.category}
            <button onClick={() => handleDelete(book._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MyBooks;
