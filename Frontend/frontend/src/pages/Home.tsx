import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";

export default function Home() {
    const navigate = useNavigate();

    return (
        <div>
            <Navbar />

            {/* 顶部留出空间避免被 fixed navbar 遮挡 */}
            <div className="pt-28 px-8">
                <h1 className="text-5xl font-bold text-gray-900 mb-8">
                    Welcome to Library Visual Index
                </h1>

                <button
                    onClick={() => navigate("/areas")}
                    className="px-8 py-4 bg-indigo-600 text-white text-xl rounded-2xl shadow-md hover:bg-indigo-700 transition"
                >
                    Enter Library Areas
                </button>
            </div>
        </div>
    );
}
