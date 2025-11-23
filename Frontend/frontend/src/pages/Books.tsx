// src/pages/Books.tsx
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import { getBooksByShelf } from "../api/books";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

interface BookInfo {
    book_id: number;
    title: string;
    author: string | null;
    summary: string | null;
    publish_year: number | null;
    cover_image_url: string | null;
}

interface BookCopyWithBook {
    copy_id: number;
    status: string;
    due_date: string | null;
    book: BookInfo;
}

export default function Books() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const shelfId = Number(searchParams.get("shelf"));

    const [list, setList] = useState<BookCopyWithBook[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function load() {
            const data = await getBooksByShelf(shelfId);
            setList(data);
            setLoading(false);
        }
        load();
    }, [shelfId]);

    if (loading) return <div className="text-center p-10 text-gray-500 text-xl">Loading...</div>;

    return (
        <div>
            <Navbar />

            <div className="pt-24 p-8 max-w-7xl mx-auto">

                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200
                    rounded-xl shadow-sm mb-6 transition"
                >
                    <ArrowLeftIcon className="h-5 w-5 text-gray-600" />
                    Back
                </button>

                <h1 className="text-4xl font-bold mb-6 text-gray-800">
                    Books on Shelf #{shelfId}
                </h1>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {list.map(item => (
                        <div
                            key={item.copy_id}
                            className="bg-white rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-1
                            transition p-4 cursor-pointer"
                            onClick={() => navigate(`/book/${item.book.book_id}`)}
                        >
                            <img
                                src={item.book.cover_image_url || "/default-cover.png"}
                                className="w-full h-60 object-cover rounded-xl mb-4"
                            />

                            <h2 className="text-2xl font-semibold">{item.book.title}</h2>

                            <p className="text-gray-600 mb-1">
                                Author: {item.book.author || "Unknown"}
                            </p>

                            {item.book.publish_year && (
                                <p className="text-gray-600 mb-1">
                                    Published: {item.book.publish_year}
                                </p>
                            )}

                            <p className="text-sm text-gray-500 mt-2 line-clamp-3">
                                {item.book.summary || "No summary available."}
                            </p>

                            <div className="mt-4 text-sm">
                                <span className="font-semibold">Status:</span>{" "}
                                {item.status === "available"
                                    ? <span className="text-green-600 font-bold">Available</span>
                                    : <span className="text-red-600 font-bold">Borrowed</span>}
                            </div>

                            {item.due_date && (
                                <p className="text-sm mt-1 text-orange-500">
                                    Due: {item.due_date}
                                </p>
                            )}
                        </div>
                    ))}
                </div>

            </div>
        </div>
    );
}
