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
            <Route path="/livres" element={<MyBooks />}/>
            <Route path="/livres/:id" element={<BookPage />} />
            <Route path="/demandes" element={<MyRequests />} />
            <Route path="/statistiques" element={<Statistics />} />
            <Route path="*" element={<h1 className="not-found text-orange-500">Page Non Trouvée</h1>} />
        </Routes>
    );
}

export default App;