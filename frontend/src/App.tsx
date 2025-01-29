import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import MyBooks from "./components/MyBooks";
import BookPage from "./components/BookPage";
import MyRequests from "./components/MyRequests";

function App()
{
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/home" element={<Home />} />
      <Route path="/mybooks" element={<MyBooks />}/>
      <Route path="/books/:id" element={<BookPage />} />
      <Route path="/myrequests" element={<MyRequests />} />
    </Routes>
  );
}

export default App;