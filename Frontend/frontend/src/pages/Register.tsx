import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiRegister } from "../api/auth";
import Navbar from "../components/Navbar";

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

            // 注册完成自动跳去登录
            navigate("/login");
        } catch (err) {
            setError("Username already exists" + err);
        }
    }

    return (
        <div>
            <Navbar />

            <div className="pt-24 flex justify-center">
                <div className="w-96 bg-white shadow-md rounded-2xl p-8">

                    <h1 className="text-3xl font-bold mb-6 text-center text-indigo-600">
                        Register
                    </h1>

                    {error && (
                        <div className="mb-3 text-red-500 text-sm text-center">
                            {error}
                        </div>
                    )}

                    <input
                        type="text"
                        placeholder="Username"
                        className="w-full p-3 border rounded-xl mb-3"
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                    />

                    <input
                        type="text"
                        placeholder="Real Name (optional)"
                        className="w-full p-3 border rounded-xl mb-3"
                        value={realName}
                        onChange={e => setRealName(e.target.value)}
                    />

                    <input
                        type="password"
                        placeholder="Password"
                        className="w-full p-3 border rounded-xl mb-6"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                    />

                    <button
                        onClick={handleRegister}
                        className="w-full py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition"
                    >
                        Create Account
                    </button>

                    <p className="mt-4 text-sm text-center text-gray-600">
                        Already have an account?{" "}
                        <span
                            className="text-indigo-600 cursor-pointer"
                            onClick={() => navigate("/login")}
                        >
                            Login
                        </span>
                    </p>

                </div>
            </div>
        </div>
    );
}
