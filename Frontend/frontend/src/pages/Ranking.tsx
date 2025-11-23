// src/pages/Ranking.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { getMonthlyRanking } from "../api/books";

interface RankedBook {
    book_id: number;
    title: string;
    author: string | null;
    publisher: string | null;
    isbn: string | null;
    category_id: number;
    summary: string | null;
    publish_year: number | null;
    cover_image_url: string | null;
    borrow_count: number;
}

export default function Ranking() {
    const [list, setList] = useState<RankedBook[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        async function load() {
            try {
                const data = await getMonthlyRanking(10);
                setList(data);
            } catch (err) {
                console.error(err);
                setError("Failed to load ranking.");
            } finally {
                setLoading(false);
            }
        }

        load();
    }, []);

    return (
        <div>
            <Navbar />

            <div className="pt-24 px-8 max-w-6xl mx-auto">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-4xl font-bold text-gray-900">
                        Monthly Top Books
                    </h1>
                    <span className="text-sm text-gray-500">
                        Based on borrow records of this month
                    </span>
                </div>

                {loading && (
                    <div className="text-center text-gray-500 text-lg py-10">
                        Loading ranking...
                    </div>
                )}

                {error && (
                    <div className="text-center text-red-500 text-lg py-6">
                        {error}
                    </div>
                )}

                {!loading && !error && list.length === 0 && (
                    <div className="text-center text-gray-500 text-lg py-10">
                        No borrow records this month yet.
                    </div>
                )}

                {!loading && !error && list.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {list.map((book, index) => (
                            <div
                                key={book.book_id}
                                className="bg-white rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-1 transition p-4 cursor-pointer flex flex-col"
                                onClick={() => navigate(`/book/${book.book_id}`)}
                            >
                                {/* 排名角标 */}
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-semibold text-gray-500">
                                        #{index + 1}
                                    </span>
                                    <span className="text-xs px-2 py-1 rounded-full bg-indigo-50 text-indigo-600">
                                        {book.borrow_count} borrows this month
                                    </span>
                                </div>

                                <img
                                    src={book.cover_image_url || "https://via.placeholder.com/300x400"}
                                    className="w-full h-56 object-cover rounded-xl mb-4"
                                />

                                <h2 className="text-xl font-semibold mb-1 line-clamp-2">
                                    {book.title}
                                </h2>

                                <p className="text-gray-600 text-sm mb-1">
                                    Author: {book.author || "Unknown"}
                                </p>

                                {book.publish_year && (
                                    <p className="text-gray-500 text-sm mb-2">
                                        Year: {book.publish_year}
                                    </p>
                                )}

                                <p className="text-sm text-gray-500 mt-auto line-clamp-3">
                                    {book.summary || "No summary available."}
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
