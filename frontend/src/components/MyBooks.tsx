import React, { useEffect, useState } from "react";
import { getBooks, addBook, updateBook, deleteBook } from "../services/BookService";

const MyBooks = () => {
  const [books, setBooks] = useState<any[]>([]);
  const [newBook, setNewBook] = useState({ title: "", author: "", category: "" });
  const [showForm, setShowForm] = useState(false);
  const [editingBook, setEditingBook] = useState<any>(null);

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
      setShowForm(false); // Cacher le formulaire après ajout
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
      setShowForm(false); // Cacher le formulaire après mise à jour
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
    setShowForm(true); // Afficher le formulaire de modification
  };

  return (
    <div>
      <h1>My Books</h1>
      <button onClick={() => setShowForm(!showForm)}>
        {showForm ? "Annuler" : "Ajouter un livre"}
      </button>

      {showForm && (
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
          <button onClick={editingBook ? handleUpdateBook : handleAddBook}>
            {editingBook ? "Mettre à jour" : "Confirmer"}
          </button>
        </div>
      )}

      <ul>
        {books.length > 0 ? (
          books.map((book) => (
            <li key={book._id}>
              {book.title} - {book.author} - {book.category}
              <button onClick={() => handleEdit(book)}>Modifier</button>
              <button onClick={() => handleDelete(book._id)}>Supprimer</button>
            </li>
          ))
        ) : (
          <p>Aucun livre trouvé.</p>
        )}
      </ul>
    </div>
  );
};

export default MyBooks;
