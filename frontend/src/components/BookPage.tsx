import { useEffect, useState, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getBookById, requestLoan } from "../services/BookService";
import Navbar from "../components/Navbar";
import { AuthContext } from "../context/AuthContext";

function BookPage()
{
    const { id }=useParams();
    const { user }=useContext(AuthContext)!;
    const navigate=useNavigate();
    const [book, setBook]=useState<any>(null);
    const [requested, setRequested]=useState(false);
    const [error, setError]=useState("");
    useEffect(()=>
    {
        if (!user)
        {
            navigate("/");
        }
    }, [user, navigate]);
    useEffect(()=>
    {
        const fetchBook=async()=>
        {
            try
            {
                const data=await getBookById(id!);
                setBook(data);
            }
            catch (error)
            {
                console.error("Error fetching book details:", error);
            }
        };
        fetchBook();
    }, [id]);
    if (!book)
    {
        return <p className="text-center text-gray-500 mt-10">Loading...</p>;
    }
    const isOwner=user?._id===book.owner?._id;
    const handleRequest=async()=>
    {
        try
        {
            await requestLoan(book._id);
            setRequested(true);
        }
        catch (error)
        {
            setError("Loan request already sent or an error occurred.");
        }
    };
    return (
        <div className="flex min-h-screen bg-gray-100">
            <Navbar />
            <main className="flex-1 flex items-center justify-center p-6">
                <div className="w-full max-w-2xl bg-white shadow-lg rounded-lg p-6">
                    <h1 className="text-3xl font-semibold text-gray-900">{book.title}</h1>
                    <div className="mt-4 space-y-2 text-lg text-gray-700">
                        <p>
                            <span className="font-semibold">Auteur:</span> {book.author}
                        </p>
                        <p>
                            <span className="font-semibold">Catégorie:</span> {book.category}
                        </p>
                        <p>
                            <span className="font-semibold">Propriétaire:</span> {book.owner?.name || "Unknown"}
                        </p>
                        <p>
                            <span className="font-semibold">Statut:</span>{" "}
                            <span
                                className={`px-2 py-1 rounded-md ${book.isAvailable?"bg-green-200 text-green-700":"bg-red-200 text-red-700"}`}
                            >{book.isAvailable?"Disponible":"Prêté"}</span>
                        </p>
                    </div>
                    {error && (<p className="mt-3 text-sm text-red-600 bg-red-100 p-2 rounded-md">{error}</p>)}
                    <div className="mt-6">
                        <button
                            className={`w-full px-5 py-2 text-white font-semibold rounded-lg transition ${!book.isAvailable || isOwner?"bg-gray-400 cursor-not-allowed":"bg-blue-600 hover:bg-blue-700"}`}
                            disabled={!book.isAvailable || isOwner}
                            onClick={handleRequest}
                        >{requested?"Demande envoyée":"Réserver"}</button>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default BookPage;