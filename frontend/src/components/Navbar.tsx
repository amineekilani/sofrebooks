import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";

function Navbar() {
  const { user, logout } = useContext(AuthContext)!;

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-white p-4 flex flex-col justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-8"><Link to="/home">SofreBooks</Link></h2>
          <div className="space-y-6">
            {user && (
              <>
                <div className="space-y-2">
                  <Link to="/mybooks" className="block text-orange-600 hover:text-orange-500">
                    My Livres
                  </Link>
                  <Link to="/myrequests" className="block text-orange-600 hover:text-orange-500">
                    My Demandes
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Logout Button */}
        {user && (
          <div className="mt-auto">
            <span className="block text-white mb-2">{user.name}</span>
            <button
              onClick={logout}
              className="w-full bg-orange-600 text-white py-2 rounded-lg hover:bg-orange-700"
            >
              Déconnexion
            </button>
          </div>
        )}
      </aside>
    </div>
  );
}

export default Navbar;
