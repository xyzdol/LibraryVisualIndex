import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
    const navigate = useNavigate();

    const userJson = localStorage.getItem("user");
    const user = userJson ? JSON.parse(userJson) : null;

    function logout() {
        localStorage.removeItem("user");
        navigate("/");
    }

    return (
        <nav className="w-full bg-white/70 backdrop-blur-lg shadow-sm fixed top-0 left-0 z-50">
            <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-3">
                <div
                    className="text-2xl font-bold text-indigo-600 cursor-pointer"
                    onClick={() => navigate("/")}
                >
                    Library Visual Index
                </div>

                <div className="flex items-center gap-6">
                    <Link to="/map">Map</Link>
                    <Link to="/search">Search</Link>
                    <Link to="/ranking">Ranking</Link>
                    <Link to="/areas">Areas</Link>
                    <Link to="/broadcasts">Broadcasts</Link>

                    {user && (
                        <Link to="/my-borrows" className="text-gray-700 hover:text-indigo-600">
                            My Borrowed
                        </Link>

                    )}

                    {user ? (
                        <>
                            <span className="font-semibold text-indigo-600">
                                {user.username || user.user?.username}
                            </span>
                            <button
                                onClick={logout}
                                className="text-red-500 hover:text-red-600"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <Link
                            to="/login"
                            className="text-gray-700 hover:text-indigo-600"
                        >
                            Login
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
}
