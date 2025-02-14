import { useEffect, useState, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getBookById, requestLoan } from "../services/BookService";
import Navbar from "./Navbar";
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
            setError("Demande déja envoyée");
        }
    };
    const totalRatings=book.likes+book.dislikes+book.neutral;
    const likesPercentage=(book.likes/totalRatings)*100;
    const dislikesPercentage=(book.dislikes/totalRatings)*100;
    const neutralPercentage=(book.neutral/totalRatings)*100;
    return (
        <div className="flex min-h-screen bg-gray-100">
            <Navbar />
            <main className="flex-1 flex items-center justify-center p-6">
                <div className="w-full max-w-2xl bg-white shadow-lg rounded-lg p-6">
                    <h1 className="text-3xl font-semibold text-gray-900">
                        <i className="bi bi-book text-gray-600 mr-2"></i>
                        {book.title}
                    </h1>
                    <div className="mt-4 space-y-2 text-lg text-gray-700">
                        <p>
                            <i className="bi bi-person text-gray-600 mr-2"></i>
                            <span className="font-semibold">Auteur:</span> {book.author}
                        </p>
                        <p>
                            <i className="bi bi-tags text-gray-600 mr-2"></i>
                            <span className="font-semibold">Catégorie:</span> {book.category}
                        </p>
                        <p>
                            <i className="bi bi-person-circle text-gray-600 mr-2"></i>
                            <span className="font-semibold">Propriétaire:</span> {book.owner?.name}
                        </p>
                        <p>
                            <i className={`bi ${book.isAvailable?"bi-check-circle-fill text-green-600":"bi-x-circle-fill text-red-600"} mr-2`}></i>
                            <span className="font-semibold">Statut:</span>{" "}
                            <span
                                className={`px-2 py-1 rounded-md ${book.isAvailable?"bg-green-200 text-green-700":"bg-red-200 text-red-700"}`}
                            >{book.isAvailable?"Disponible":"Prêté"}</span>
                        </p>
                        {book.borrower?.name && (
                            <p>
                                <i className="bi bi-person-raised-hand text-gray-600 mr-2"></i>
                                <span className="font-semibold">Emprunteur actuel:</span> {book.borrower.name}
                            </p>
                        )}
                    </div>
                    <div className="mt-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-2">Réactions des lecteurs</h2>
                        <div className="w-full h-6 bg-gray-200 rounded-full overflow-hidden flex">
                            <div
                                className="h-full bg-green-400"
                                style={{ width: `${likesPercentage}%` }}
                                title={`J'aime: ${likesPercentage.toFixed(2)}%`}
                            ></div>
                            <div
                                className="h-full bg-gray-300"
                                style={{ width: `${neutralPercentage}%` }}
                                title={`Neutre: ${neutralPercentage.toFixed(2)}%`}
                            ></div>
                            <div
                                className="h-full bg-red-400"
                                style={{ width: `${dislikesPercentage}%` }}
                                title={`Je n'aime pas: ${dislikesPercentage.toFixed(2)}%`}
                            ></div>
                        </div>
                        <div className="mt-2 flex justify-between text-sm text-gray-600">
                            <span>J'aime: {book.likes}</span>
                            <span>Neutre: {book.neutral}</span>
                            <span>Je n'aime pas: {book.dislikes}</span>
                        </div>
                    </div>
                    <div className="mt-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-2">
                            <i className="bi bi-file-text text-gray-600 mr-2"></i> Résumé du livre <em className="text-gray-300">(généré par IA)</em>
                        </h2>
                        <div className="bg-gray-50 border-l-4 border-blue-500 p-4 rounded-md shadow-sm text-gray-700">
                            <p className="leading-relaxed text-md">{book.summary}</p>
                        </div>
                    </div>
                    {error && (
                        <p className="mt-3 text-sm text-red-600 bg-red-100 p-2 rounded-md">
                            <i className="bi bi-exclamation-circle-fill mr-2"></i> {error}
                        </p>
                    )}
                    <div className="mt-6">
                        <button
                            className={`w-full px-5 py-2 text-white font-semibold rounded-lg transition ${!book.isAvailable || isOwner?"bg-gray-400 cursor-not-allowed":"bg-blue-600 hover:bg-blue-700"}`}
                            disabled={!book.isAvailable || isOwner}
                            onClick={handleRequest}
                        >
                            <i className={`bi ${requested?"bi-envelope-check-fill":"bi-cart-plus-fill"} mr-2`}></i>
                            {requested?"Demande envoyée":"Réserver"}
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default BookPage;