import { Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Login from "./components/Login";
import Register from "./components/Register";
import MyBooks from "./components/MyBooks";
import BookPage from "./components/BookPage";
import MyRequests from "./components/MyRequests";
import Statistics from "./components/Statistics";

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
            <Route path="/statistics" element={<Statistics />} />
            <Route path="*" element={<h1 className="not-found text-orange-500">Page Non Trouvée</h1>} />
        </Routes>
    );
}

export default App;