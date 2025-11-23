import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiRegister } from "../api/auth";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

export default function Register() {
    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [realName, setRealName] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    async function handleRegister() {
        try {
            await apiRegister({
                username,
                password,
                real_name: realName,
            });
            navigate("/login");
        } catch {
            setError("Username already exists");
        }
    }

    return (
        <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gray-50 p-4">

            {/* Back */}
            <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200
                    rounded-xl shadow-sm mb-6 transition self-start ml-4"
            >
                <ArrowLeftIcon className="h-5 w-5 text-gray-600" />
                Back
            </button>

            <div className="bg-white shadow-xl rounded-xl p-10 w-96">
                <h1 className="text-3xl font-bold text-indigo-600 text-center mb-6">
                    Register
                </h1>

                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-4"
                />

                <input
                    type="text"
                    placeholder="Real Name"
                    value={realName}
                    onChange={(e) => setRealName(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-4"
                />

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-4"
                />

                <button
                    onClick={handleRegister}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg"
                >
                    Register
                </button>

                <p className="text-center mt-4 text-sm">
                    Already have an account?
                    <Link to="/login" className="text-indigo-600 ml-1 hover:underline">
                        Login
                    </Link>
                </p>

                {error && <p className="text-red-500 text-sm mt-3">{error}</p>}
            </div>

        </div>
    );
}
