import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import { getBooks, getLoanRequestsForOwner } from "../services/BookService";
import api from "../services/api";

function Home()
{
    const { user }=useContext(AuthContext)!;
    const navigate=useNavigate();
    const [books, setBooks]=useState<any[]>([]);
    const [searchTerm, setSearchTerm]=useState("");
    const [searchTriggered, setSearchTriggered]=useState(false);
    const [ownerLoanRequests, setOwnerLoanRequests]=useState<any[]>([]);
    const [currentPage, setCurrentPage]=useState(1);
    const booksPerPage=3;
    useEffect(()=>
    {
        if (!user)
        {
            navigate("/");
        }
    }, [user, navigate]);
    useEffect(()=>
    {
        const fetchLoanRequests=async()=>
        {
            try
            {
                const ownerRequests=await getLoanRequestsForOwner();
                setOwnerLoanRequests(ownerRequests);
            }
            catch (error)
            {
                console.error("Error fetching loan requests:", error);
            }
        };
        fetchLoanRequests();
    }, []);
    const fetchBooks=async()=>
    {
        try
        {
            const data=await getBooks();
            setBooks(data);
        }
        catch (error)
        {
            console.error("Error fetching books:", error);
        }
    }
    const handleSearch=(e: React.ChangeEvent<HTMLInputElement>)=>
    {
        setSearchTerm(e.target.value);
        if (!searchTriggered)
        {
            setSearchTriggered(true);
            fetchBooks();
        }
    }
    const handleAccept=async(requestId: string)=>
    {
        try
        {
            await api.put(`/loans/accept/${requestId}`, {}, { withCredentials: true });
            setOwnerLoanRequests((prev)=>prev.map((req)=>(req._id===requestId?{ ...req, status: "approved" }:req)));
        }
        catch (error)
        {
            console.error("Error accepting loan request:", error);
        }
    }
    const handleDecline=async(requestId: string)=>
    {
        try
        {
            await api.put(`/loans/decline/${requestId}`, {}, { withCredentials: true });
            setOwnerLoanRequests((prev)=>prev.map((req)=>(req._id===requestId?{ ...req, status: "rejected" }:req)));
        }
        catch (error)
        {
            console.error("Error declining loan request:", error);
        }
    }
    const filteredBooks=books.filter((book)=>book.title.toLowerCase().includes(searchTerm.toLowerCase()) || book.author.toLowerCase().includes(searchTerm.toLowerCase()) || book.category.toLowerCase().includes(searchTerm.toLowerCase()));
    const availableBooks=books.filter(book=>book.isAvailable===true);
    const indexOfLastBook=currentPage * booksPerPage;
    const indexOfFirstBook=indexOfLastBook-booksPerPage;
    const currentBooks=availableBooks.slice(indexOfFirstBook, indexOfLastBook);
    const totalPages=Math.ceil(availableBooks.length/booksPerPage);
    return (
        <div className="flex min-h-screen">
            <Navbar />
            <main className="flex-1 p-6 bg-gray-50">
                <h1 className="text-3xl font-bold mb-8">
                    <i className="bi bi-book-half text-orange-500 mr-2"></i>
                    <span className="text-orange-500">Welcome to SofreBooks</span>
                </h1>
                <input
                    type="search"
                    placeholder="Rechercher des livres"
                    value={searchTerm}
                    onChange={handleSearch}
                    className="p-3 w-full mb-6 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                {searchTriggered && searchTerm && (
                    <ul>
                        {filteredBooks.length>0?(filteredBooks.map((book)=>(
                            <li key={book._id}>
                                <Link to={`/livres/${book._id}`} className="text-orange-600 hover:text-orange-500">
                                    <i className="bi bi-journal-bookmark-fill text-orange-500 mr-2"></i>
                                    {book.title} de {book.author} ({book.category})
                                </Link>
                            </li>
                        ))):(<p className="col-span-full text-center text-gray-500">Pas de livres trouvés.</p>)}
                    </ul>
                )}
                <h3 className="text-2xl font-semibold mb-4">
                    <i className="bi bi-check-circle-fill text-green-500 mr-2"></i>
                    Livres Disponibles
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {currentBooks.length>0?(currentBooks.map((book)=>(
                        <div key={book._id} className="shadow-md rounded-lg p-4 bg-white">
                            <h4 className="text-lg font-semibold text-gray-700">{book.title}</h4>
                            <p className="text-gray-500">{book.author}</p>
                            <p className="text-gray-400 text-sm">{book.category}</p>
                            <Link to={`/livres/${book._id}`} className="text-green-600 hover:text-green-500 mt-2 inline-block">
                                <i className="bi bi-book text-green-500 mr-2"></i>
                                Consulter le livre
                            </Link>
                        </div>
                    ))):(<p className="col-span-full text-center text-gray-500">Aucun livre disponible.</p>)}
                </div>
                {totalPages>1 && (
                    <div className="flex justify-center mt-6 space-x-4">
                        <button
                            onClick={()=>setCurrentPage(prev=>Math.max(prev-1,1))}
                            disabled={currentPage===1}
                            className={`py-2 px-4 rounded-lg ${currentPage===1?"bg-gray-300 cursor-not-allowed":"bg-orange-500 text-white hover:bg-orange-600"}`}
                        >Précédent</button>
                        <span className="text-gray-700 font-semibold">Page {currentPage} sur {totalPages}</span>
                        <button
                            onClick={()=>setCurrentPage(prev=>Math.min(prev+1,totalPages))}
                            disabled={currentPage === totalPages}
                            className={`py-2 px-4 rounded-lg ${currentPage === totalPages ? "bg-gray-300 cursor-not-allowed" : "bg-orange-500 text-white hover:bg-orange-600"}`}
                        >Suivant</button>
                    </div>
                )}
                <h3 className="text-2xl font-semibold mt-4 mb-4">
                    <i className="bi bi-hourglass-split text-orange-500 mr-2"></i>
                    Demandes De Prêt Pour Vos Livres
                </h3>
                <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {ownerLoanRequests.length>0?(ownerLoanRequests.sort((a,b)=>new Date(b.createdAt).getTime()-new Date(a.createdAt).getTime()).map((req)=>(
                        <div key={req._id} className="shadow-md rounded-lg p-4 bg-white">
                            <p className="text-gray-300">
                                <i className="bi bi-calendar-event-fill mr-2"></i>
                                {new Date(req.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                            </p>
                            <p className="text-lg font-medium">
                                <i className="bi bi-person-fill text-gray-500 mr-2"></i>
                                {req.borrower.name} veut emprunter
                            </p>
                            <strong className="block text-xl">
                                <i className="bi bi-book text-gray-600 mr-2"></i>
                                {req.book.title}
                            </strong>
                            <em className="text-gray-600">
                                <i className="bi bi-info-circle-fill text-gray-500 mr-2"></i>
                                {
                                    req.status==="pending"?"En attente":
                                    req.status==="approved"?"Approuvé":
                                    req.status==="rejected"?"Rejeté":"Retourné"
                                }
                            </em>
                            {req.status==="pending" && (
                                <div className="mt-4 flex justify-between">
                                    <button
                                        onClick={() => handleAccept(req._id)}
                                        className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600"
                                    >
                                        <i className="bi bi-check-circle-fill mr-2"></i>
                                        Accepter
                                    </button>
                                    <button
                                        onClick={() => handleDecline(req._id)}
                                        className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600"
                                    >
                                        <i className="bi bi-x-circle-fill mr-2"></i>
                                        Refuser
                                    </button>
                                </div>
                            )}
                        </div>
                    ))):(<p className="col-span-full text-center text-gray-500">Aucune demande de prêt en attente.</p>)}
                </div>
            </main>
        </div>
    );
}

export default Home;