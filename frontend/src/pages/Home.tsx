import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
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
    };
    const handleSearch=(e: React.ChangeEvent<HTMLInputElement>)=>
    {
        setSearchTerm(e.target.value);
        if (!searchTriggered)
        {
            setSearchTriggered(true);
            fetchBooks();
        }
    };
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
    };
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
    };
    const filteredBooks=books.filter((book)=>book.title.toLowerCase().includes(searchTerm.toLowerCase()) || book.author.toLowerCase().includes(searchTerm.toLowerCase()) || book.category.toLowerCase().includes(searchTerm.toLowerCase()));
    return (
        <div className="flex min-h-screen">
            <Navbar />
            <main className="flex-1 p-6 bg-gray-50">
                <h1 className="text-3xl font-bold mb-8">Welcome to SofreBooks</h1>
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
                                <Link to={`/books/${book._id}`} className="text-orange-600 hover:text-orange-500">
                                    {book.title} de {book.author} ({book.category})
                                </Link>
                            </li>
                        ))):(<p>Pas de livres.</p>)}
                    </ul>
                )}
                {ownerLoanRequests.length>0 && (
                    <div>
                        <h3 className="text-2xl font-semibold mb-4">Demandes De Prêt Pour Vos Livres</h3>
                        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {ownerLoanRequests.length>0?(ownerLoanRequests.map((req)=>(
                                <div key={req._id} className="shadow-md rounded-lg p-4 bg-white">
                                    <p className="text-lg font-medium">{req.borrower.name} veut avoir</p>
                                    <strong className="block text-xl">{req.book.title}</strong>
                                    <em className="text-gray-600">({req.status})</em>
                                    {req.status==="pending" && (
                                        <div className="mt-4 flex justify-between">
                                            <button
                                                onClick={()=>handleAccept(req._id)}
                                                className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600"
                                            >Accepter</button>
                                            <button
                                                onClick={()=>handleDecline(req._id)}
                                                className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600"
                                            >Refuser</button>
                                        </div>
                                    )}
                                </div>
                            ))):(<p className="col-span-full text-center text-gray-500">Pas de demandes.</p>)}
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}

export default Home;