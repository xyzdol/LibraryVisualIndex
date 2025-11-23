// src/components/Navbar.tsx
import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
    const { pathname } = useLocation();

    const links = [
        { name: "Home", path: "/" },
        { name: "Search", path: "/search" },
        { name: "Ranking", path: "/ranking" },
        { name: "Areas", path: "/areas" },
        { name: "Broadcasts", path: "/broadcasts" },
        { name: "Login", path: "/login" }
    ];

    return (
        <nav className="w-full bg-white/70 backdrop-blur-lg shadow-sm fixed top-0 left-0 z-50">
            <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-3">
                <div className="text-2xl font-bold text-indigo-600">
                    Library Visual Index
                </div>

                <div className="flex items-center gap-6">
                    {links.map(link => (
                        <Link
                            key={link.path}
                            to={link.path}
                            className={`text-sm font-medium transition ${
                                pathname === link.path
                                    ? "text-indigo-600 font-semibold"
                                    : "text-gray-700 hover:text-indigo-600"
                            }`}
                        >
                            {link.name}
                        </Link>
                    ))}
                </div>
            </div>
        </nav>
    );
}
