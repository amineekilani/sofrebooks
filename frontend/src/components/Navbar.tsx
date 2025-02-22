import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";
import SofrecomLogo from '../assets/sofrecom-logo.png';

function Navbar()
{
    const { user, logout }=useContext(AuthContext)!;
    return (
        <div className="flex min-h-screen">
            <aside className="w-64 bg-gray-800 text-white p-4 flex flex-col justify-between">
                <div>
                    <h2 className="text-2xl font-bold mb-8"><Link to="/home"><img src={SofrecomLogo} alt="Sofrecom" className="mx-auto mb-4 w-24 h-24" /></Link></h2>
                    <div className="space-y-6">
                        {user && (
                            <>
                                <div className="space-y-2">
                                    <Link to="/livres" className="block text-orange-600 hover:text-orange-500">
                                        <i className="bi bi-book mr-2"></i>
                                        Mes Livres
                                    </Link>
                                    <Link to="/demandes" className="block text-orange-600 hover:text-orange-500">
                                        <i className="bi bi-journal-check mr-2"></i>
                                        Mes Demandes
                                    </Link>
                                    <Link to="/statistiques" className="block text-orange-600 hover:text-orange-500">
                                        <i className="bi bi-bar-chart-line mr-2"></i>
                                        Statistiques
                                    </Link>
                                </div>
                            </>
                        )}
                    </div>
                </div>
                {user && (
                    <div className="mt-auto">
                        <span className="block text-white mb-2">
                            <i className="bi bi-person-circle mr-2"></i>
                            {user.name}
                        </span>
                        <button
                            onClick={logout}
                            className="w-full bg-orange-600 text-white py-2 rounded-lg hover:bg-orange-700"
                        >
                            <i className="bi bi-box-arrow-right mr-2"></i>
                            Déconnexion
                        </button>
                        <p className="text-gray-400 text-sm text-center mt-4">
                            &copy; 2025 Amine Kilani chez Sofrecom<br/>Tous droits réservés
                        </p>
                    </div>
                )}
            </aside>
        </div>
    );
}

export default Navbar;