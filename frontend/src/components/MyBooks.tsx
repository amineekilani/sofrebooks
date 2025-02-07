import React, { useContext, useEffect, useState } from "react";
import { addBook, updateBook, deleteBook, getBooksByUser, BookCategory } from "../services/BookService";
import Navbar from "./Navbar";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const MyBooks=()=>
{
    const { user }=useContext(AuthContext)!;
    const navigate=useNavigate();
    const [books, setBooks]=useState<any[]>([]);
    const [newBook, setNewBook]=useState({ title: "", author: "", category: BookCategory.Fiction, isbn: "", publisher: "", publicationYear: "" });
    const [showForm, setShowForm]=useState(false);
    const [editingBook, setEditingBook]=useState<any>(null);
    useEffect(()=>
    {
        if (!user)
        {
            navigate("/");
        }
    }, [user, navigate]);
    useEffect(()=>
    {
        fetchBooks();
    }, []);
    const fetchBooks=async()=>
    {
        try
        {
            const data=await getBooksByUser();
            setBooks(data);
        }
        catch (error)
        {
            console.error("Error fetching books", error);
        }
    };
    const handleAddBook=async()=>
    {
        if (!newBook.title || !newBook.author || !newBook.category || !newBook.isbn || !newBook.publisher || !newBook.publicationYear)
        {
            alert("Veuillez remplir tous les champs !");
            return;
        }
        try
        {
            await addBook(newBook);
            setNewBook({ title: "", author: "", category: BookCategory.Fiction, isbn: "", publisher: "", publicationYear: "" });
            setShowForm(false);
            fetchBooks();
        }
        catch (error)
        {
            console.error("Error adding book", error);
        }
    };
    const handleUpdateBook=async()=>
    {
        if (!newBook.title || !newBook.author || !newBook.category || !newBook.isbn || !newBook.publisher || !newBook.publicationYear)
        {
            alert("Veuillez remplir tous les champs !");
            return;
        }
        try
        {
            await updateBook(editingBook._id, newBook);
            setNewBook({ title: "", author: "", category: BookCategory.Fiction, isbn: "", publisher: "", publicationYear: "" });
            setEditingBook(null);
            setShowForm(false);
            fetchBooks();
        }
        catch (error)
        {
            console.error("Error updating book", error);
        }
    };
    const handleDelete=async(id: string)=>
    {
        try
        {
            await deleteBook(id);
            fetchBooks();
        }
        catch (error)
        {
            console.error("Error deleting book", error);
        }
    };
    const handleEdit=(book: any)=>
    {
        setEditingBook(book);
        setNewBook({ title: book.title, author: book.author, category: book.category, isbn: book.isbn, publisher: book.publisher, publicationYear: book.publicationYear });
        setShowForm(true);
    };
    return (
        <div className="flex min-h-screen">
            <Navbar />
            <main className="flex-1 p-6 bg-gray-50">
                <h1 className="text-3xl font-bold mb-8">
                    <i className="bi bi-book text-orange-500 mr-2"></i>
                    <span className="text-orange-500">Mes Livres</span>
                </h1>
                <button
                    onClick={()=>setShowForm(!showForm)}
                    className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
                >
                    <i className={`bi ${showForm ? "bi-x-circle" : "bi-plus-circle"} mr-2`}></i>
                    {showForm?"Annuler":"Ajouter un livre"}
                </button>
                {showForm && (
                    <div className="mt-6 space-y-4">
                        <input
                            type="text"
                            placeholder="Titre"
                            value={newBook.title}
                            onChange={(e)=>setNewBook({ ...newBook, title: e.target.value })}
                            className="p-3 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                        <input
                            type="text"
                            placeholder="Auteur"
                            value={newBook.author}
                            onChange={(e)=>setNewBook({ ...newBook, author: e.target.value })}
                            className="p-3 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                        <select
                            value={newBook.category}
                            onChange={(e)=>setNewBook({ ...newBook, category: e.target.value as BookCategory })}
                            className="p-3 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                        >{Object.values(BookCategory).map((cat)=>(<option key={cat} value={cat}>{cat}</option>))}</select>
                        <input
                            type="text"
                            placeholder="ISBN"
                            value={newBook.isbn}
                            onChange={(e) => setNewBook({ ...newBook, isbn: e.target.value })}
                            className="p-3 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                        <input
                            type="text"
                            placeholder="Maison d'édition"
                            value={newBook.publisher}
                            onChange={(e) => setNewBook({ ...newBook, publisher: e.target.value })}
                            className="p-3 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                        <input
                            type="number"
                            placeholder="Année de publication"
                            value={newBook.publicationYear}
                            onChange={(e)=>setNewBook({ ...newBook, publicationYear: parseInt(e.target.value) })}
                            className="p-3 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                        <button
                            onClick={editingBook?handleUpdateBook:handleAddBook}
                            className="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600"
                        >{editingBook?"Modifier":"Confirmer"}</button>
                    </div>
                )}
                <ul className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {books.length>0?(books.map((book)=>
                    (
                        <div key={book._id} className="shadow-md rounded-lg p-4 bg-white">
                            <h3 className="text-lg font-semibold">
                                <i className="bi bi-book text-gray-500 mr-2"></i>
                                {book.title}
                            </h3>
                            <p className="text-gray-600">
                                <i className="bi bi-person text-gray-500 mr-2"></i>
                                Auteur: {book.author}
                            </p>
                            <p className="text-gray-600">
                                <i className="bi bi-tags-fill text-gray-500 mr-2"></i>
                                Catégorie: {book.category}
                            </p>
                            <p className="text-gray-600">
                                <i className="bi bi-upc-scan text-gray-500 mr-2"></i>
                                ISBN: {book.isbn}
                            </p>
                            <p className="text-gray-600">
                                <i className="bi bi-building text-gray-500 mr-2"></i>
                                Maison d'édition: {book.publisher}
                            </p>
                            <p className="text-gray-600">
                                <i className="bi bi-calendar text-gray-500 mr-2"></i>
                                Année de publication: {book.publicationYear}
                            </p>
                            <div className="mt-4 flex justify-between">
                                <button
                                    onClick={()=>handleEdit(book)}
                                    className="bg-yellow-500 text-white py-2 px-4 rounded-md hover:bg-yellow-600"
                                >
                                    <i className="bi bi-pencil-fill mr-2"></i>
                                    Modifier
                                </button>
                                <button
                                    onClick={()=>handleDelete(book._id)}
                                    className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600"
                                >
                                    <i className="bi bi-trash-fill mr-2"></i>
                                    Supprimer
                                </button>
                            </div>
                        </div>
                    ))):(<p className="col-span-full text-gray-500"><i className="bi bi-exclamation-circle-fill text-gray-400 mr-2"></i> Pas de livres.</p>)}
                </ul>
            </main>
        </div>
    );
};

export default MyBooks;