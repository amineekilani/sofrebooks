import Navbar from "./Navbar";

function Statistics()
{
    return (
        <div className="flex min-h-screen">
            <Navbar />
            <main className="flex-1 p-6 bg-gray-50">
                Stats
            </main>
        </div>
    );
}

export default Statistics;