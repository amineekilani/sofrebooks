import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import SofrecomLogo from '../assets/sofrecom-logo.png';

function Register()
{
    const { register }=useContext(AuthContext)!;
    const [name, setName]=useState("");
    const [email, setEmail]=useState("");
    const [password, setPassword]=useState("");
    const [confirmPassword, setConfirmPassword]=useState("");
    const [error, setError]=useState("");
    const handleSubmit=async(e: React.FormEvent)=>
    {
        e.preventDefault();
        if (password!==confirmPassword)
        {
            setError("Les mots de passe ne correspondent pas");
            return;
        }
        try
        {
            setError("");
            await register(name, email, password);
        }
        catch (err: any)
        {
            setError(err.response?.data?.message || "Email déjà utilisé");
        }
    };
    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-sm w-full">
                <div className="text-center mb-8">
                    <img src={SofrecomLogo} alt="Sofrecom" className="mx-auto mb-4 w-24 h-24" />
                    <h1 className="text-3xl font-bold text-gray-800">SofreBooks</h1>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <input
                            type="text"
                            placeholder="Nom"
                            value={name}
                            onChange={(e)=>setName(e.target.value)}
                            required
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                    </div>
                    <div className="mb-4">
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e)=>setEmail(e.target.value)}
                            required
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                    </div>
                    <div className="mb-4">
                        <input
                            type="password"
                            placeholder="Mot de passe"
                            value={password}
                            onChange={(e)=>setPassword(e.target.value)}
                            required
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                    </div>
                    <div className="mb-6">
                        <input
                            type="password"
                            placeholder="Confirmer le mot de passe"
                            value={confirmPassword}
                            onChange={(e)=>setConfirmPassword(e.target.value)}
                            required
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full p-3 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    >S'inscrire</button>
                </form>
                <div className="mt-4 text-center">
                    <a href="/" className="text-orange-500 hover:underline">Vous avez déjà un compte ? Se connecter</a>
                </div>
                {error && <p className="text-red-500 text-center mt-4">{error}</p>}
            </div>
        </div>
    );
}

export default Register;