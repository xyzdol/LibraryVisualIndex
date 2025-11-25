// src/pages/BookDetail.tsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

import {
    getBookDetail,
    getFirstAvailableCopy,
    type BookDetailInfo,
} from "../api/books";

import { borrowBook } from "../api/borrowRecord";
import { ArrowLeftIcon, MapIcon } from "@heroicons/react/24/outline";

export default function BookDetail() {
    const { bookId } = useParams();
    const navigate = useNavigate();

    const [book, setBook] = useState<BookDetailInfo | null>(null);
    const [loading, setLoading] = useState(true);

    async function handleBorrow() {
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        const userId = user.user?.user_id ?? user.user_id;

        await borrowBook(Number(bookId), userId);
        alert("Borrow success!");
    }

    // ⭐ 新增：定位书架按钮
    async function handleLocate() {
        const data = await getFirstAvailableCopy(Number(bookId));

        if (!data) {
            alert("No available copy. All copies are borrowed!");
            return;
        }

        // 跳转到  /map?shelf=xxx
        navigate(`/map?shelf=${data.shelf_id}`);
    }

    useEffect(() => {
        async function load() {
            const data = await getBookDetail(Number(bookId));
            setBook(data);
            setLoading(false);
        }
        load();
    }, [bookId]);

    if (loading) return <div className="pt-24 text-center text-gray-500">Loading...</div>;
    if (!book) return <div className="pt-24 text-center text-gray-500">Book not found</div>;

    return (
        <div>
            <Navbar />

            <div className="max-w-4xl mx-auto pt-28 px-6">
                {/* 返回按钮 */}
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200
                    rounded-xl shadow-sm mb-6 transition"
                >
                    <ArrowLeftIcon className="h-5 w-5 text-gray-600" />
                    Back
                </button>

                <div className="bg-white shadow-lg p-6 rounded-2xl flex gap-8">
                    <img
                        src={book.cover_image_url || "https://via.placeholder.com/400x550"}
                        className="w-64 h-96 rounded-xl object-cover shadow-md"
                    />

                    <div className="flex flex-col">
                        <h1 className="text-3xl font-bold text-gray-900">{book.title}</h1>

                        <p className="mt-2 text-gray-700 text-lg">
                            <span className="font-semibold">Author:</span> {book.author || "Unknown"}
                        </p>

                        <p className="mt-1 text-gray-700 text-lg">
                            <span className="font-semibold">Publisher:</span> {book.publisher || "Unknown"}
                        </p>

                        <p className="mt-1 text-gray-700 text-lg">
                            <span className="font-semibold">Published Year:</span> {book.publish_year || "Unknown"}
                        </p>

                        {/* ⭐ Borrow 按钮 */}
                        <button
                            onClick={handleBorrow}
                            className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
                        >
                            Borrow Book
                        </button>

                        {/* ⭐ Locate 按钮 */}
                        <button
                            onClick={handleLocate}
                            className="mt-3 flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
                        >
                            <MapIcon className="h-5 w-5 text-white" />
                            Locate on Map
                        </button>

                        <h2 className="text-xl font-semibold mt-6">Summary</h2>
                        <p className="text-gray-600 leading-relaxed">
                            {book.summary || "No summary available."}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
