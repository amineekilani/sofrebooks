import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LoanHistory from './pages/LoanHistory';
import Home from "./pages/Home";
import BookPage from "./pages/BookPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/book/:id" element={<BookPage />} />
        <Route path="/loan-history" element={<LoanHistory userId="currentUserId" />} />
      </Routes>
    </Router>
  );
}

export default App;
