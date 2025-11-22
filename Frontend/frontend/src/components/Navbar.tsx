import { Link } from "react-router-dom";

export default function Navbar() {
    return (
        <nav className="w-full p-4 bg-blue-500 text-white flex space-x-6">
            <Link to="/">Home</Link>
            <Link to="/search">Search</Link>
            <Link to="/ranking">Ranking</Link>
            <Link to="/areas">Areas</Link>
            <Link to="/shelves">Shelves</Link>
            <Link to="/broadcasts">Broadcasts</Link>
            <Link to="/login">Login</Link>
        </nav>
    );
}
