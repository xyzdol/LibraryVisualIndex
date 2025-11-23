// src/pages/BookDetail.tsx
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import { getBookDetail } from "../api/books";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

interface BookDetailInfo {
    book_id: number;
    title: string;
    author: string | null;
    publisher: string | null;
    isbn: string | null;
    publish_year: number | null;
    summary: string | null;
    cover_image_url: string | null;
}

export default function BookDetail() {
    const { bookId } = useParams();
    const navigate = useNavigate();

    const [book, setBook] = useState<BookDetailInfo | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function load() {
            try {
                const data = await getBookDetail(Number(bookId));
                setBook(data);
            } catch (err) {
                console.error("Failed to load book:", err);
            } finally {
                setLoading(false);
            }
        }
        load();
    }, [bookId]);

    if (loading) return <div className="text-center p-10 text-gray-500 text-xl">Loading...</div>;
    if (!book) return <div className="p-10 text-gray-500 text-xl">Book not found.</div>;

    return (
        <div>
            <Navbar />

            <div className="max-w-4xl mx-auto pt-28 px-6">
                {/* Back button */}
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200
                    rounded-xl shadow-sm mb-6 transition"
                >
                    <ArrowLeftIcon className="h-5 w-5 text-gray-600" />
                    Back
                </button>

                <div className="bg-white shadow-lg p-6 rounded-2xl flex gap-8">

                    {/* Cover Image */}
                    <img
                        src={book.cover_image_url || "https://via.placeholder.com/400x550"}
                        className="w-64 h-96 rounded-xl object-cover shadow-md"
                    />

                    <div className="flex flex-col">
                        <h1 className="text-3xl font-bold text-gray-900">{book.title}</h1>

                        {book.author && (
                            <p className="mt-2 text-gray-700 text-lg">
                                <span className="font-semibold">Author:</span> {book.author}
                            </p>
                        )}

                        {book.publisher && (
                            <p className="mt-1 text-gray-700 text-lg">
                                <span className="font-semibold">Publisher:</span> {book.publisher}
                            </p>
                        )}

                        {book.publish_year && (
                            <p className="mt-1 text-gray-700 text-lg">
                                <span className="font-semibold">Year:</span> {book.publish_year}
                            </p>
                        )}

                        {book.isbn && (
                            <p className="mt-1 text-gray-700 text-lg">
                                <span className="font-semibold">ISBN:</span> {book.isbn}
                            </p>
                        )}

                        <h2 className="text-xl font-semibold mt-6 mb-2">Summary</h2>
                        <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                            {book.summary || "No summary available."}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
