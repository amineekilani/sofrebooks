import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { getLoanRequestsForBorrower } from "../services/BookService";
import api from "../services/api";
import Navbar from "./Navbar";
import { useNavigate } from "react-router-dom";

function MyRequests()
{
    const { user }=useContext(AuthContext)!;
    const navigate=useNavigate();
    const [borrowerLoanRequests, setBorrowerLoanRequests]=useState<any[]>([]);
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
                const borrowerRequests=await getLoanRequestsForBorrower();
                setBorrowerLoanRequests(borrowerRequests);
            }
            catch (error)
            {
                console.error("Error fetching loan requests:", error);
            }
        };
        fetchLoanRequests();
    }, []);
    const handleReturnBook=async(requestId: string)=>
    {
        try
        {
            await api.put(`/loans/return/${requestId}`, {}, { withCredentials: true });
            setBorrowerLoanRequests((prev)=>prev.map((req)=>(req._id===requestId?{ ...req, status: "returned" }:req)));
        }
        catch (error)
        {
            console.error("Error returning book:", error);
        }
    };
    return (
        <div className="flex min-h-screen">
            <Navbar />
            <main className="flex-1 p-6 bg-gray-50">
                <h3 className="text-3xl font-bold mb-8">Vos Demandes</h3>
                <ul className="space-y-4">
                    {borrowerLoanRequests.length>0?(
                        borrowerLoanRequests.map((req)=>(
                            <li key={req._id} className="flex justify-between items-center p-4 bg-white rounded-md shadow-md">
                                <span>
                                    Vous avez demandé <strong>{req.book.title}</strong> <em>({req.status})</em>
                                </span>
                                {req.status==="approved" && (
                                    <button
                                        onClick={() => handleReturnBook(req._id)}
                                        className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600"
                                    >Retourner le livre</button>
                                )}
                            </li>
                    ))):(<p>Pas de demandes.</p>)}
                </ul>
            </main>
        </div>
    );
}

export default MyRequests;