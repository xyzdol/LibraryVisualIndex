// src/pages/Ranking.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { getMonthlyRanking } from "../api/books";

interface RankedBook {
    book_id: number;
    title: string;
    author: string | null;
    summary: string | null;
    cover_image_url: string | null;
    publish_year: number | null;
    borrow_count: number;
}

export default function Ranking() {
    const [list, setList] = useState<RankedBook[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        async function load() {
            try {
                const data = await getMonthlyRanking(20);
                setList(data);
            } finally {
                setLoading(false);
            }
        }
        load();
    }, []);

    if (loading) {
        return <div className="text-center text-gray-500 pt-40 text-xl">Loading ranking...</div>;
    }

    if (list.length === 0) {
        return <div className="text-center text-gray-500 pt-40 text-xl">No ranking available.</div>;
    }

    const top1 = list[0];
    const top2 = list[1];
    const top3 = list[2];
    const others = list.slice(3);

    return (
        <div>
            <Navbar />

            <div className="pt-24 px-8 max-w-6xl mx-auto">
                <h1 className="text-4xl font-bold text-gray-900 mb-8">Monthly Top Books</h1>

                {/* 🥇 第一名 */}
                <div
                    className="bg-yellow-50 border border-yellow-200 rounded-2xl shadow-lg p-6 mb-10 cursor-pointer hover:scale-[1.01] transition"
                    onClick={() => navigate(`/book/${top1.book_id}`)}
                >
                    <div className="text-2xl font-bold text-yellow-700 mb-2">🥇 #1 Champion</div>

                    <div className="flex gap-6">
                        <img
                            src={top1.cover_image_url || "/default-cover.png"}
                            className="w-48 h-64 object-cover rounded-xl shadow-md"
                        />

                        <div className="flex flex-col justify-between">
                            <div>
                                <h2 className="text-3xl font-bold text-gray-900">{top1.title}</h2>

                                <p className="text-gray-600 mt-2">
                                    Author: {top1.author || "Unknown"}
                                </p>

                                {top1.publish_year && (
                                    <p className="text-gray-500">Year: {top1.publish_year}</p>
                                )}
                            </div>

                            <div className="text-lg font-semibold text-yellow-700 mt-4">
                                🔥 {top1.borrow_count} borrows this month
                            </div>
                        </div>
                    </div>
                </div>

                {/* 🥈 第二名 & 🥉 第三名 */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
                    {top2 && (
                        <div
                            className="bg-gray-50 border border-gray-200 rounded-2xl shadow p-4 cursor-pointer hover:shadow-lg transition"
                            onClick={() => navigate(`/book/${top2.book_id}`)}
                        >
                            <div className="text-xl font-bold text-gray-700 mb-2">🥈 #2</div>
                            <img
                                src={top2.cover_image_url || "/default-cover.png"}
                                className="w-full h-52 object-cover rounded-xl mb-3"
                            />
                            <h2 className="text-lg font-semibold">{top2.title}</h2>
                            <p className="text-gray-600 text-sm">Author: {top2.author}</p>
                        </div>
                    )}

                    {top3 && (
                        <div
                            className="bg-orange-50 border border-orange-200 rounded-2xl shadow p-4 cursor-pointer hover:shadow-lg transition"
                            onClick={() => navigate(`/book/${top3.book_id}`)}
                        >
                            <div className="text-xl font-bold text-orange-700 mb-2">🥉 #3</div>
                            <img
                                src={top3.cover_image_url || "/default-cover.png"}
                                className="w-full h-52 object-cover rounded-xl mb-3"
                            />
                            <h2 className="text-lg font-semibold">{top3.title}</h2>
                            <p className="text-gray-600 text-sm">Author: {top3.author}</p>
                        </div>
                    )}
                </div>

                {/* 4th and more */}
                <div className="space-y-4">
                    {others.map((book, index) => (
                        <div
                            key={book.book_id}
                            onClick={() => navigate(`/book/${book.book_id}`)}
                            className="flex items-center gap-4 bg-white rounded-xl shadow p-4 hover:shadow-md transition cursor-pointer"
                        >
                            <div className="text-xl font-bold text-gray-500 w-10 text-center">
                                #{index + 4}
                            </div>

                            <img
                                src={book.cover_image_url || "/default-cover.png"}
                                className="w-16 h-20 object-cover rounded-md"
                            />

                            <div>
                                <h3 className="font-semibold text-gray-800">{book.title}</h3>
                                <p className="text-gray-500 text-sm">Author: {book.author}</p>
                            </div>

                            <div className="ml-auto text-indigo-600 font-semibold">
                                {book.borrow_count} borrows
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
