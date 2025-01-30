import React, { useContext, useEffect, useState } from "react";
import { addBook, updateBook, deleteBook, getBooksByUser } from "../services/BookService";
import Navbar from "./Navbar";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const MyBooks = () => {
  const { user } = useContext(AuthContext)!;
  const navigate = useNavigate();
  const [books, setBooks] = useState<any[]>([]);
  const [newBook, setNewBook] = useState({ title: "", author: "", category: "" });
  const [showForm, setShowForm] = useState(false);
  const [editingBook, setEditingBook] = useState<any>(null);

  useEffect(() => {
    if (!user) {
      navigate("/");
    }
  }, [user, navigate]);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const data = await getBooksByUser();
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
      setShowForm(false);
      fetchBooks();
    } catch (error) {
      console.error("Error adding book", error);
    }
  };

  const handleUpdateBook = async () => {
    if (!newBook.title || !newBook.author || !newBook.category) return;
    try {
      await updateBook(editingBook._id, newBook);
      setNewBook({ title: "", author: "", category: "" });
      setEditingBook(null);
      setShowForm(false);
      fetchBooks();
    } catch (error) {
      console.error("Error updating book", error);
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

  const handleEdit = (book: any) => {
    setEditingBook(book);
    setNewBook({ title: book.title, author: book.author, category: book.category });
    setShowForm(true);
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <Navbar />

      {/* Main Content */}
      <main className="flex-1 p-6 bg-gray-50">
        <h1 className="text-3xl font-bold mb-8">My Books</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
        >
          {showForm ? "Cancel" : "Add a Book"}
        </button>

        {showForm && (
          <div className="mt-6 space-y-4">
            <input
              type="text"
              placeholder="Title"
              value={newBook.title}
              onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
              className="p-3 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <input
              type="text"
              placeholder="Author"
              value={newBook.author}
              onChange={(e) => setNewBook({ ...newBook, author: e.target.value })}
              className="p-3 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <input
              type="text"
              placeholder="Category"
              value={newBook.category}
              onChange={(e) => setNewBook({ ...newBook, category: e.target.value })}
              className="p-3 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <button
              onClick={editingBook ? handleUpdateBook : handleAddBook}
              className="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600"
            >
              {editingBook ? "Update" : "Confirm"}
            </button>
          </div>
        )}

        <ul className="mt-8">
          {books.length > 0 ? (
            books.map((book) => (
              <li key={book._id} className="mb-6 flex justify-between items-center">
                <span className="font-medium">
                  {book.title} - {book.author} - {book.category}
                </span>
                <div>
                  <button
                    onClick={() => handleEdit(book)}
                    className="bg-yellow-500 text-white py-2 px-4 rounded-md hover:bg-yellow-600 mr-4"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(book._id)}
                    className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))
          ) : (
            <p>No books found.</p>
          )}
        </ul>
      </main>
    </div>
  );
};

export default MyBooks;
