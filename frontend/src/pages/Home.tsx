import React, { useState } from 'react';
import api from '../services/api';
import { Link } from 'react-router-dom';

const Home = () => {
  const [search, setSearch] = useState('');
  const [books, setBooks] = useState<any[]>([]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await api.get(`/books?search=${search}`);
      setBooks(response.data);
    } catch (error) {
      console.error("Error fetching books", error);
    }
  };

  return (
    <div>
      <h1>Search for Books</h1>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Search by title or author"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>

      <div>
        {books.map((book) => (
          <div key={book._id}>
            <h3>
              <Link to={`/book/${book._id}`}>{book.title}</Link>
            </h3>
            <p>Author: {book.author}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
