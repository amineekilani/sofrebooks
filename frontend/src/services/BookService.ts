import api from "./api";

const API_URL = "/books";

// Fetch all books (no authentication required)
export const getBooks = async () => {
  const response = await api.get(API_URL, { withCredentials: true });
  return response.data;
};

// Fetch books owned by the logged-in user
export const getBooksByUser = async () => {
  const response = await api.get(`${API_URL}/user`, { withCredentials: true });
  return response.data;
};

export const addBook = async (bookData: { title: string; author: string; category: string }) => {
  const response = await api.post(API_URL, bookData, { withCredentials: true });
  return response.data;
};

export const updateBook = async (id: string, updatedData: { title: string; author: string; category: string }) => {
  const response = await api.put(`${API_URL}/${id}`, updatedData, { withCredentials: true });
  return response.data;
};

export const deleteBook = async (id: string) => {
  const response = await api.delete(`${API_URL}/${id}`, { withCredentials: true });
  return response.data;
};

export const getBookById = async (id: string) => {
  const response = await api.get(`/books/${id}`, { withCredentials: true });
  return response.data;
};