import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { searchBooks } from "../api/books";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

interface Book {
    book_id: number;
    title: string;
    author: string | null;
    summary: string | null;
    publish_year: number | null;
    cover_image_url: string | null;
}

export default function Search() {
    const [keyword, setKeyword] = useState("");
    const [results, setResults] = useState<Book[]>([]);
    const navigate = useNavigate();

    async function handleSearch() {
        if (!keyword.trim()) {
            setResults([]);
            return;
        }

        const data = await searchBooks(keyword);
        setResults(data);
    }

    return (
        <div>
            <Navbar />

            <div className="pt-24 px-8 max-w-6xl mx-auto">

                {/* 返回按钮 */}
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200
                               rounded-xl shadow-sm mb-6 transition"
                >
                    <ArrowLeftIcon className="h-5 w-5 text-gray-600" />
                    Back
                </button>

                <h1 className="text-4xl font-bold mb-6 text-gray-800">Search Books</h1>

                {/* 搜索输入框 */}
                <div className="flex gap-4 mb-8">
                    <input
                        type="text"
                        placeholder="Enter book title..."
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                        className="flex-1 border border-gray-300 rounded-lg px-4 py-2"
                    />

                    <button
                        onClick={handleSearch}
                        className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                    >
                        Search
                    </button>
                </div>

                {/* 空状态 */}
                {keyword.trim() && results.length === 0 && (
                    <p className="text-gray-500 text-lg">No books found.</p>
                )}

                {/* 搜索结果 */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {results.map((book) => (
                        <div
                            key={book.book_id}
                            className="bg-white rounded-2xl shadow-md hover:shadow-xl transition
                                       p-4 cursor-pointer"
                            onClick={() => navigate(`/book/${book.book_id}`)}
                        >
                            <img
                                src={book.cover_image_url || "https://via.placeholder.com/300x400"}
                                className="w-full h-60 object-cover rounded-xl mb-4"
                            />

                            <h2 className="text-2xl font-semibold mb-1">{book.title}</h2>

                            <p className="text-gray-600 mb-1">
                                Author: {book.author || "Unknown"}
                            </p>

                            {book.publish_year && (
                                <p className="text-gray-600 mb-1">Published: {book.publish_year}</p>
                            )}

                            <p className="text-sm text-gray-500 mt-2 line-clamp-3">
                                {book.summary || "No summary available."}
                            </p>
                        </div>
                    ))}
                </div>

            </div>
        </div>
    );
}
