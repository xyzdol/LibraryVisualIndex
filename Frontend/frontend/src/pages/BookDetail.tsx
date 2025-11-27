// src/pages/BookDetail.tsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import {getComments, createComment, type CommentOut, deleteComment} from "../api/comments";

import {
    getBookDetail,
    getFirstAvailableCopy,
    type BookDetailInfo,
    type FirstAvailableCopy,
    type BookStats,
    getBookStats,
} from "../api/books";

import { borrowBook } from "../api/borrowRecord";
import { ArrowLeftIcon, MapIcon } from "@heroicons/react/24/outline";

export default function BookDetail() {

    const rawUser = localStorage.getItem("user");
    const currentUserId = rawUser ? (JSON.parse(rawUser).user?.user_id ?? JSON.parse(rawUser).user_id) : null;


    const [isWriting, setIsWriting] = useState(false);


    const { bookId } = useParams();
    const navigate = useNavigate();

    // 书信息 & 状态
    const [book, setBook] = useState<BookDetailInfo | null>(null);
    const [stats, setStats] = useState<BookStats | null>(null);
    const [loading, setLoading] = useState(true);

    // 当前这本书“第一本可借副本”的信息
    const [availableCopy, setAvailableCopy] =
        useState<FirstAvailableCopy | null>(null);
    const [checkingCopy, setCheckingCopy] = useState(true);

    // 借书按钮 loading
    const [borrowLoading, setBorrowLoading] = useState(false);
    const canBorrow = !!availableCopy && !borrowLoading;

    // 评论
    const [comments, setComments] = useState<CommentOut[]>([]);
    const [newComment, setNewComment] = useState("");
    const [isAnonymous, setIsAnonymous] = useState(false);

    // ------- 评论相关函数 --------
    async function handleDeleteComment(commentId: number) {
        const ok = confirm("Are you sure you want to delete this comment?");
        if (!ok) return;

        try {
            await deleteComment(commentId);
            await loadComments(); // 重新加载评论
        } catch (err) {
            console.error(err);
            alert("Failed to delete comment.");
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
        loadComments(); // 自动刷新评论
    }

    // ------- 页面加载：书详情 + 统计 + 可借副本 + 评论 --------
    useEffect(() => {
        async function load() {
            if (!bookId) return;

            setLoading(true);
            setCheckingCopy(true);

            try {
                // 详情 + 副本 + 统计 并行拉取
                const [detail, copy, s] = await Promise.all([
                    getBookDetail(Number(bookId)),
                    getFirstAvailableCopy(Number(bookId)),
                    getBookStats(Number(bookId)),
                ]);

                setBook(detail);
                setAvailableCopy(copy); // null 代表“已借完”
                setStats(s);

                // 评论单独拉
                await loadComments();
            } catch (err) {
                console.error("Failed to load book detail:", err);
            } finally {
                setLoading(false);
                setCheckingCopy(false);
            }
        }

        load();
    }, [bookId]);

    // ------- 借书逻辑：用 availableCopy.copy_id，而不是 bookId --------
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


    // ------- 定位逻辑：随时刷新一下 first_available_copy --------
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
                <div className="pt-24 text-center text-gray-500">
                    Book not found
                </div>
            </div>
        );
    }

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

            <div className="max-w-4xl mx-auto pt-28 px-6 pb-10">
                {/* 返回按钮 */}
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200
                    rounded-xl shadow-sm mb-6 transition"
                >
                    <ArrowLeftIcon className="h-5 w-5 text-gray-600" />
                    Back
                </button>

                {/* 书籍详情卡片 */}
                <div className="bg-white shadow-lg p-6 rounded-2xl flex flex-col lg:flex-row gap-8">
                    <img
                        src={
                            book.cover_image_url ||
                            "https://via.placeholder.com/400x550"
                        }
                        className="w-64 h-96 rounded-xl object-cover shadow-md mx-auto lg:mx-0"
                    />

                    <div className="flex flex-col flex-1">
                        <h1 className="text-3xl font-bold text-gray-900">
                            {book.title}
                        </h1>

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

                        {/* 动态 Borrow 按钮 */}
                        <button
                            onClick={handleBorrow}
                            disabled={!canBorrow}
                            className={`mt-4 text-white px-4 py-2 rounded-lg transition ${borrowBtnClass}`}
                        >
                            {borrowText}
                        </button>

                        {/* Locate 按钮 */}
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
                                    <strong>Available:</strong> {stats.available} /{" "}
                                    {stats.total}
                                </p>

                                {stats.available === 0 &&
                                    stats.next_return_date && (
                                        <p className="mt-1 text-red-600">
                                            <strong>Next return:</strong>{" "}
                                            {stats.next_return_date}
                                        </p>
                                    )}
                            </div>
                        )}

                        <h2 className="text-xl font-semibold mt-6">Summary</h2>
                        <p className="text-gray-600 leading-relaxed">
                            {book.summary || "No summary available."}
                        </p>
                    </div>
                </div>

                {/* ====================== 评论区：整块放在下面，两列布局 ====================== */}
                {/* ====================== 评论区 ====================== */}
                <div className="mt-14">
                    <h2 className="text-2xl font-semibold mb-6">Comments</h2>

                    {/* 评论列表 */}
                    <div className="mb-6 space-y-4">
                        {comments.length === 0 ? (
                            <p className="text-gray-500 text-center">No comments yet.</p>
                        ) : (
                            comments.map((c) => (
                                <div
                                    key={c.comment_id}
                                    className="bg-white p-5 rounded-xl shadow-sm flex gap-4 items-start relative"
                                >
                                    {/* 头像 */}
                                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 font-bold">
                                        {c.is_anonymous ? "?" : (c.user_id ?? "U")}
                                    </div>

                                    {/* 内容区域：全宽 */}
                                    <div className="flex-1">
                                        <div className="flex justify-between items-center">
            <span className="font-semibold">
                {c.is_anonymous ? "Anonymous" : `User ${c.user_id}`}
            </span>

                                            <span className="text-xs text-gray-400 mr-8">
                {new Date(c.created_at).toLocaleString()}
            </span>
                                        </div>

                                        <p className="mt-1 text-gray-700">{c.content}</p>
                                    </div>

                                    {/* 删除按钮 —— 右侧，不挡时间 */}
                                    {!c.is_anonymous && c.user_id === currentUserId && (
                                        <button
                                            onClick={() => handleDeleteComment(c.comment_id)}
                                            className="text-red-500 hover:text-red-700 text-lg p-2"
                                            title="Delete comment"
                                        >
                                            🗑
                                        </button>
                                    )}
                                </div>

                            ))
                        )}
                    </div>

                    {/* + 添加评论按钮 */}
                    {!isWriting && (
                        <div className="text-center">
                            <button
                                onClick={() => setIsWriting(true)}
                                className="px-6 py-2 bg-indigo-600 text-white rounded-full shadow hover:bg-indigo-700 transition"
                            >
                                + Add Comment
                            </button>
                        </div>
                    )}

                    {/* 输入框区域 */}
                    {isWriting && (
                        <div className="bg-gray-100 p-4 rounded-xl mt-6 transition-all">
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

                            <div className="flex gap-3">
                                <button
                                    onClick={handleSubmitComment}
                                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                                >
                                    Submit Comment
                                </button>

                                <button
                                    onClick={() => {
                                        setIsWriting(false);
                                        setNewComment("");
                                        setIsAnonymous(false);
                                    }}
                                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}
