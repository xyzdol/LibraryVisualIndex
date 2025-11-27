// src/pages/BookDetail.tsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { getComments, createComment, type CommentOut } from "../api/comments";



import {
    getBookDetail,
    getFirstAvailableCopy,
    type BookDetailInfo,
    type FirstAvailableCopy,
    type BookStats,
    getBookStats
} from "../api/books";

import { borrowBook } from "../api/borrowRecord";
import { ArrowLeftIcon, MapIcon } from "@heroicons/react/24/outline";

export default function BookDetail() {
    const [comments, setComments] = useState<CommentOut[]>([]);
    const [newComment, setNewComment] = useState("");
    const [isAnonymous, setIsAnonymous] = useState(false);

    const { bookId } = useParams();
    const navigate = useNavigate();

    const [stats, setStats] = useState<BookStats | null>(null);


    const [book, setBook] = useState<BookDetailInfo | null>(null);
    const [loading, setLoading] = useState(true);

    // ⭐ 当前这本书“第一本可借副本”的信息
    const [availableCopy, setAvailableCopy] = useState<FirstAvailableCopy | null>(null);
    const [checkingCopy, setCheckingCopy] = useState(true);

    // 借书按钮 loading
    const [borrowLoading, setBorrowLoading] = useState(false);

    // 方便判断是否还能借
    const canBorrow = !!availableCopy && !borrowLoading;

    useEffect(() => {
        async function load() {
            const data = await getBookDetail(Number(bookId));
            setBook(data);

            const s = await getBookStats(Number(bookId));
            setStats(s);

            setLoading(false);

            if (!bookId) return;

            setLoading(true);
            setCheckingCopy(true);

            try {
                // 并行请求：书的详情 + 当前可借副本
                const [detail, copy] = await Promise.all([
                    getBookDetail(Number(bookId)),
                    getFirstAvailableCopy(Number(bookId)),
                ]);

                setBook(detail);
                setAvailableCopy(copy); // null 代表“已借完”
            } catch (err) {
                console.error("Failed to load book detail:", err);
            } finally {
                setLoading(false);
                setCheckingCopy(false);
            }
        }
        load();
    }, [bookId]);

    /** ⭐ 借书逻辑：用 availableCopy.copy_id，而不是 bookId */
    async function handleBorrow() {
        if (!bookId) return;

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
            alert("Login info invalid, please login again.");
            navigate("/login");
            return;
        }

        const userId = parsed.user?.user_id ?? parsed.user_id;
        if (!userId) {
            alert("Cannot find your user id, please login again.");
            navigate("/login");
            return;
        }

        if (!availableCopy) {
            alert("All copies are currently borrowed. Please try later.");
            return;
        }

        try {
            setBorrowLoading(true);
            await borrowBook(availableCopy.copy_id, userId);

            // 借书成功：把可借副本置空 ⇒ 按钮变灰
            setAvailableCopy(null);

            alert("Borrow success!");
        } catch (err: unknown) {
            console.error("Borrow failed:", err);
            let msg = "Borrow failed.";
            if (err instanceof Error) {
                try {
                    const obj = JSON.parse(err.message);
                    if (obj.detail) msg = obj.detail;
                    else msg = err.message;
                } catch {
                    msg = err.message;
                }
            }
            alert(msg);
        } finally {
            setBorrowLoading(false);
        }
    }
    async function loadComments() {
        if (!bookId) return;
        const data = await getComments(Number(bookId));
        setComments(data);
    }

    async function handleSubmitComment() {
        const raw = localStorage.getItem("user");
        if (!raw) {
            alert("Please login first.");
            navigate("/login");
            return;
        }

        const parsed = JSON.parse(raw);
        const userId = parsed.user?.user_id ?? parsed.user_id;

        if (!newComment.trim()) {
            alert("Comment cannot be empty");
            return;
        }

        await createComment({
            book_id: Number(bookId),
            user_id: userId,
            content: newComment,
            is_anonymous: isAnonymous,
        });

        setNewComment("");
        setIsAnonymous(false);
        loadComments(); // ⭐ 自动刷新评论
    }


    async function handleLocate() {
        if (!bookId) return;
        const latestCopy = await getFirstAvailableCopy(Number(bookId));

        if (!latestCopy) {
            alert("No available copy. All copies are borrowed!");
            return;
        }

        setAvailableCopy(latestCopy);

        navigate(`/map?shelf=${latestCopy.shelf_id}`);
    }


    if (loading) {
        return (
            <div>
                <Navbar />
                <div className="pt-24 text-center text-gray-500">Loading...</div>
            </div>
        );
    }

    if (!book) {
        return (
            <div>
                <Navbar />
                <div className="pt-24 text-center text-gray-500">Book not found</div>
            </div>
        );
    }

    // 根据是否有可借副本 / 是否在检查，决定按钮文案和颜色
    let borrowText = "Borrow Book";
    if (checkingCopy) {
        borrowText = "Checking availability...";
    } else if (!availableCopy) {
        borrowText = "All copies borrowed";
    }

    const borrowBtnClass = canBorrow
        ? "bg-indigo-600 hover:bg-indigo-700 cursor-pointer"
        : "bg-gray-400 cursor-not-allowed";

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
                            <span className="font-semibold">Author:</span>{" "}
                            {book.author || "Unknown"}
                        </p>

                        <p className="mt-1 text-gray-700 text-lg">
                            <span className="font-semibold">Publisher:</span>{" "}
                            {book.publisher || "Unknown"}
                        </p>

                        <p className="mt-1 text-gray-700 text-lg">
                            <span className="font-semibold">Published Year:</span>{" "}
                            {book.publish_year || "Unknown"}
                        </p>

                        {/* ⭐ 动态 Borrow 按钮 */}
                        <button
                            onClick={handleBorrow}
                            disabled={!canBorrow}
                            className={`mt-4 text-white px-4 py-2 rounded-lg transition ${borrowBtnClass}`}
                        >
                            {borrowText}
                        </button>

                        {/* ⭐ Locate 按钮（即使已借完也可以看位置） */}
                        <button
                            onClick={handleLocate}
                            className="mt-3 flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
                        >
                            <MapIcon className="h-5 w-5 text-white" />
                            Locate on Map
                        </button>

                        {stats && (
                            <div className="mt-4 p-3 bg-gray-100 rounded-xl text-sm text-gray-700">
                                <p>
                                    <strong>Available:</strong> {stats.available} / {stats.total}
                                </p>

                                {stats.available === 0 && stats.next_return_date && (
                                    <p className="mt-1 text-red-600">
                                        <strong>Next return:</strong> {stats.next_return_date}
                                    </p>
                                )}
                            </div>
                        )}

                        <h2 className="text-xl font-semibold mt-6">Summary</h2>
                        <p className="text-gray-600 leading-relaxed">
                            {book.summary || "No summary available."}
                        </p>
                        {/* ====================== 评论区 ====================== */}
                        <h2 className="text-2xl font-semibold mt-10 mb-4">Comments</h2>

                        <div className="bg-gray-100 p-4 rounded-xl mb-6">
    <textarea
        value={newComment}
        onChange={(e) => setNewComment(e.target.value)}
        placeholder="Write a comment..."
        className="w-full p-3 rounded-lg border border-gray-300 mb-3"
        rows={3}
    />

                            <label className="flex items-center mb-3">
                                <input
                                    type="checkbox"
                                    checked={isAnonymous}
                                    onChange={(e) => setIsAnonymous(e.target.checked)}
                                    className="mr-2"
                                />
                                Post anonymously
                            </label>

                            <button
                                onClick={handleSubmitComment}
                                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                            >
                                Submit Comment
                            </button>
                        </div>

                        {/* 评论列表 */}
                        <div className="space-y-4">
                            {comments.length === 0 ? (
                                <p className="text-gray-500">No comments yet.</p>
                            ) : (
                                comments.map((c) => (
                                    <div
                                        key={c.comment_id}
                                        className="bg-white p-4 shadow rounded-xl"
                                    >
                                        <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold">
                        {c.is_anonymous ? "Anonymous" : `User ${c.user_id}`}
                    </span>
                                            <span className="text-xs text-gray-400">
                        {new Date(c.created_at).toLocaleString()}
                    </span>
                                        </div>
                                        <p>{c.content}</p>
                                    </div>
                                ))
                            )}
                        </div>


                    </div>
                </div>
            </div>
        </div>
    );
}
