// src/pages/Home.tsx
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";

export default function Home() {
    const navigate = useNavigate();

    return (
        <div
            className="min-h-screen bg-cover bg-center"
            style={{
                backgroundImage: "url('/background/bkg1.jpg')",
            }}
        >
            <Navbar />

            <div className="pt-32 flex flex-col items-center justify-center text-white text-center backdrop-blur-sm bg-black/30 py-20 mx-6 rounded-3xl">
                <h1 className="text-5xl font-bold mb-6 drop-shadow-lg">
                    Library Visual Index System
                </h1>

                <p className="text-lg max-w-2xl mb-10 opacity-90">
                    Explore books, find shelves, navigate the library — all in one place.
                </p>

                <div className="flex flex-col sm:flex-row gap-5">
                    <button
                        className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full text-lg shadow-lg"
                        onClick={() => navigate("/search")}
                    >
                        Search Books
                    </button>

                    <button
                        className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white rounded-full text-lg shadow-lg"
                        onClick={() => navigate("/areas")}
                    >
                        Explore Areas
                    </button>

                    <button
                        className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full text-lg shadow-lg"
                        onClick={() => navigate("/broadcasts")}
                    >
                        Broadcasting
                    </button>
                </div>
            </div>
        </div>
    );
}
