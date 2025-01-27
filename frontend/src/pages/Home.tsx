import { useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

function Home() {
  const { user } = useContext(AuthContext)!;
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) navigate("/");
  }, [user, navigate]);

  return (
    <div>
      <Navbar />
      <h1>Welcome to the Home Page</h1>
      <input type="search" placeholder="Search for books" />
    </div>
  );
}

export default Home;