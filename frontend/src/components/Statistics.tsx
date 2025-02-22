import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, CartesianGrid, BarChart, XAxis, YAxis, Bar } from "recharts";
import Navbar from "./Navbar";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { getBooks } from "../services/BookService";

function Statistics()
{
    const { user }=useContext(AuthContext)!;
    const navigate=useNavigate();
    const [books, setBooks]=useState<any[]>([]);
    useEffect(()=>
    {
        if (!user)
        {
            navigate("/");
        }
    }, [user, navigate]);
    useEffect(()=>
    {
        const fetchBooks=async()=>
        {
            try
            {
                const data=await getBooks();
                setBooks(data);
            }
            catch (error)
            {
                console.error("Erreur lors de la récupération des livres :", error);
            }
        };
        fetchBooks();
    }, []);
    const availableBooks=books.filter(book=>book.isAvailable===true).length;
    const borrowedBooks=books.length-availableBooks;
    const data=[
        { name: "Livres Disponibles", value: availableBooks },
        { name: "Livres Empruntés", value: borrowedBooks },
    ];
    const COLORS=["#008000", "#FF0000"];
    const categoryCounts: Record<string, number>={};
    books.forEach(book=>
    {
        if (book.category)
        {
            categoryCounts[book.category]=(categoryCounts[book.category]||0)+1;
        }
    });
    const barData=Object.keys(categoryCounts).map(category=>({
        name: category,
        "Nombre de Livres": categoryCounts[category],
    }));
    return (
        <div className="flex min-h-screen">
            <Navbar />
            <div className="bg-white p-6 rounded-lg shadow-md flex w-full gap-6">
                <div className="w-1/2">
                    <h2 className="text-2xl font-semibold mb-4 text-orange-500">Disponibilité des Livres</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={data}
                                cx="50%" cy="50%" 
                                innerRadius={50} 
                                outerRadius={100} 
                                fill="#8884D8"
                                paddingAngle={5}
                                dataKey="value"
                            >{data.map((entry,index)=>(<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]}/>))}</Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
                <div className="w-1/2">
                    <h2 className="text-2xl font-semibold mb-4 text-orange-500">Répartition des Livres par Catégorie</h2>
                    <ResponsiveContainer width="100%" height={400}>
                        <BarChart data={barData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="Nombre de Livres" fill="#FFA500" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}

export default Statistics;