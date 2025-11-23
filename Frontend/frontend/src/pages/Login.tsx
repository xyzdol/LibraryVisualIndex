import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiLogin } from "../api/auth";

export default function Login() {
    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    async function handleLogin() {
        try {
            const user = await apiLogin({ username, password });

            localStorage.setItem("user", JSON.stringify(user));

            navigate("/");
        } catch (err) {
            setError("Invalid username or password: " + err);
        }
    }

    return (
        <div className="w-full h-screen flex items-center justify-center pt-24">
            <div className="bg-white shadow-xl rounded-xl p-10 w-96">
                <h1 className="text-3xl font-bold text-indigo-600 text-center mb-6">Login</h1>

                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
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
                    onClick={handleLogin}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg"
                >
                    Login
                </button>

                <p className="text-center mt-4 text-sm">
                    No account?
                    <Link to="/register" className="text-indigo-600 ml-1 hover:underline">
                        Register
                    </Link>
                </p>

                {error && <p className="text-red-500 text-sm mt-3">{error}</p>}
            </div>
        </div>
    );
}
