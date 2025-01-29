import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";

function Navbar() {
  const { user, logout } = useContext(AuthContext)!;

  return (
    <nav style={{ display: "flex", justifyContent: "space-between", background: "#333", color: "#fff" }}>
      <h2>My App</h2>
      <div>
        {user && (
          <>
            <div><Link to="">My Requests</Link></div>
            <div><Link to="/mybooks">My Books</Link></div>
            <span style={{ marginRight: "10px" }}>Hello, {user.name}</span>
            <button onClick={logout} style={{ background: "red", color: "white", border: "none", padding: "5px 10px" }}>
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;