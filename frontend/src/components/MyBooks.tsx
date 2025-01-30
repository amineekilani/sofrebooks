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
        <h1 className="text-3xl font-bold mb-8">Mes Livres</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
        >
          {showForm ? "Cancel" : "Ajouter un livre"}
        </button>

        {showForm && (
          <div className="mt-6 space-y-4">
            <input
              type="text"
              placeholder="Titre"
              value={newBook.title}
              onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
              className="p-3 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <input
              type="text"
              placeholder="Auteur"
              value={newBook.author}
              onChange={(e) => setNewBook({ ...newBook, author: e.target.value })}
              className="p-3 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <input
              type="text"
              placeholder="Catégorie"
              value={newBook.category}
              onChange={(e) => setNewBook({ ...newBook, category: e.target.value })}
              className="p-3 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <button
              onClick={editingBook ? handleUpdateBook : handleAddBook}
              className="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600"
            >
              {editingBook ? "Modifier" : "Confirmer"}
            </button>
          </div>
        )}

<ul className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
  {books.length > 0 ? (
    books.map((book) => (
      <div key={book._id} className="shadow-md rounded-lg p-4 bg-white">
        <h3 className="text-lg font-semibold">{book.title}</h3>
        <p className="text-gray-600">Author: {book.author}</p>
        <p className="text-gray-600">Category: {book.category}</p>
        <div className="mt-4 flex justify-between">
          <button
            onClick={() => handleEdit(book)}
            className="bg-yellow-500 text-white py-2 px-4 rounded-md hover:bg-yellow-600"
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
      </div>
    ))
  ) : (
    <p className="col-span-full text-center text-gray-500">No books found.</p>
  )}
</ul>

      </main>
    </div>
  );
};

export default MyBooks;