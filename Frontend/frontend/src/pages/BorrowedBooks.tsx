// src/pages/BorrowedBooks.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import {
    getUserBorrowedBooks,
    returnBook,
    type BorrowedRecordWithBook,
} from "../api/borrowRecord";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

export default function BorrowedBooks() {
    const [borrowedBooks, setBorrowedBooks] = useState<BorrowedRecordWithBook[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        async function load() {
            const raw = localStorage.getItem("user");
            if (!raw) {
                alert("Please login first.");
                navigate("/login");
                return;
            }

            let parsed: { user?: { user_id?: number }; user_id?: number };
            try {
                parsed = JSON.parse(raw);
            } catch {
                alert("Login info invalid, please re-login.");
                navigate("/login");
                return;
            }

            const userId = parsed.user?.user_id ?? parsed.user_id;
            if (!userId) {
                alert("Cannot find your user id, please re-login.");
                navigate("/login");
                return;
            }

            const data = await getUserBorrowedBooks(userId);
            setBorrowedBooks(data);
            setLoading(false);
        }

        load();
    }, [navigate]);

    async function handleReturn(recordId: number) {
        await returnBook(recordId);
        setBorrowedBooks((prev) =>
            prev.filter((r) => r.record_id !== recordId)
        );
    }

    if (loading) {
        return (
            <div className="text-center p-10 text-gray-500 text-xl">
                Loading...
            </div>
        );
    }

    return (
        <div>
            <Navbar />
            <div className="pt-24 px-8 max-w-6xl mx-auto">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => navigate(-1)}
                            className="flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl shadow-sm"
                        >
                            <ArrowLeftIcon className="h-5 w-5 text-gray-600" />
                            Back
                        </button>
                        <h1 className="text-3xl font-bold text-gray-900">
                            My Borrowed Books
                        </h1>
                    </div>
                </div>

                {borrowedBooks.length === 0 ? (
                    <p className="text-gray-500 text-lg">
                        No borrowed books yet.
                    </p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {borrowedBooks.map((record) => (
                            <div
                                key={record.record_id}
                                className="bg-white rounded-2xl shadow-md p-4 flex flex-col"
                            >
                                <img
                                    src={
                                        record.book.cover_image_url ||
                                        "https://via.placeholder.com/300x400"
                                    }
                                    className="w-full h-56 object-cover rounded-xl mb-4"
                                />
                                <h2 className="text-xl font-semibold mb-1">
                                    {record.book.title}
                                </h2>
                                <p className="text-gray-600 mb-1">
                                    Author: {record.book.author || "Unknown"}
                                </p>
                                {record.book.publish_year && (
                                    <p className="text-gray-500 mb-1">
                                        Year: {record.book.publish_year}
                                    </p>
                                )}
                                <p className="text-sm text-gray-500 line-clamp-3 mb-2">
                                    {record.book.summary ||
                                        "No summary available."}
                                </p>

                                <p className="text-sm mb-1">
                                    <span className="font-semibold">Due:</span>{" "}
                                    {record.copy.due_date || "N/A"}
                                </p>
                                <p className="text-sm mb-3">
                                    <span className="font-semibold">
                                        Status:
                                    </span>{" "}
                                    {record.status}
                                </p>

                                <button
                                    onClick={() => handleReturn(record.record_id)}
                                    className="mt-auto inline-flex justify-center rounded-xl bg-red-500
                                    px-4 py-2 text-white font-semibold hover:bg-red-600"
                                >
                                    Return Book
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
