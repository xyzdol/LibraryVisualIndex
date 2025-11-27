import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";

import {
    getBroadcasts,
    createBroadcast,
    deleteBroadcast,
    type BroadcastOut,
} from "../api/broadcasts";
import { getAreas } from "../api/areas";

interface Area {
    area_id: number;
    name: string;
    floor: number;
    description: string | null;
}

export default function Broadcasts() {
    const rawUser = localStorage.getItem("user");
    const currentUserId = rawUser
        ? (() => {
            try {
                const parsed = JSON.parse(rawUser);
                return parsed.user?.user_id ?? parsed.user_id ?? null;
            } catch {
                return null;
            }
        })()
        : null;

    const [areaList, setAreaList] = useState<Area[]>([]);
    const [selectedArea, setSelectedArea] = useState<number | "all">("all");

    const [postAreaId, setPostAreaId] = useState<number | "">("");

    const [broadcasts, setBroadcasts] = useState<BroadcastOut[]>([]);
    const [loading, setLoading] = useState(true);

    const [isWriting, setIsWriting] = useState(false);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [isAnonymous, setIsAnonymous] = useState(false);

    // 🔥 统一封装获取广播的方法，避免写三次
    async function loadBroadcasts(area: number | "all") {
        setLoading(true);
        try {
            const data =
                area === "all" ? await getBroadcasts() : await getBroadcasts(Number(area));
            setBroadcasts(data);
        } finally {
            setLoading(false);
        }
    }

    // 初始化 + 切换区域加载广播列表
    useEffect(() => {
        let cancelled = false;

        (async () => {
            const areas = (await getAreas()) as unknown as Area[];
            if (!cancelled) setAreaList(areas);

            if (!cancelled) await loadBroadcasts(selectedArea);
        })();

        return () => {
            cancelled = true;
        };
    }, [selectedArea]);

    // 提交广播
    async function handleSubmit() {
        if (!currentUserId) return alert("Please login first.");
        if (!title.trim()) return alert("Title cannot be empty");
        if (!content.trim()) return alert("Content cannot be empty");
        if (postAreaId === "") return alert("Please select an area before publishing.");

        await createBroadcast({
            user_id: currentUserId,
            area_id: Number(postAreaId),
            title,
            content,
            is_anonymous: isAnonymous,
        });

        setIsWriting(false);
        setTitle("");
        setContent("");
        setIsAnonymous(false);
        setPostAreaId("");

        await loadBroadcasts(selectedArea);
    }

    // 删除广播
    async function handleDelete(id: number) {
        if (!confirm("Delete this broadcast?")) return;

        await deleteBroadcast(id);

        await loadBroadcasts(selectedArea);
    }

    return (
        <div>
            <Navbar />
            <div className="max-w-5xl mx-auto pt-24 px-6 pb-20">
                <h1 className="text-3xl font-bold mb-6">Broadcasts</h1>

                {/* 区域筛选 */}
                <div className="mb-6 flex gap-3 items-center">
                    <span className="text-gray-600 text-sm">Filter by area:</span>
                    <select
                        value={selectedArea}
                        onChange={(e) =>
                            setSelectedArea(
                                e.target.value === "all" ? "all" : Number(e.target.value)
                            )
                        }
                        className="p-2 border rounded-lg"
                    >
                        <option value="all">All Areas</option>
                        {areaList.map((a) => (
                            <option key={a.area_id} value={a.area_id}>
                                {a.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* 广播列表 */}
                {loading ? (
                    <p className="text-gray-500">Loading...</p>
                ) : broadcasts.length === 0 ? (
                    <p className="text-gray-500">No broadcasts yet.</p>
                ) : (
                    <div className="space-y-4">
                        {broadcasts.map((b) => (
                            <div
                                key={b.broadcast_id}
                                className="bg-white p-4 rounded-xl shadow-sm"
                            >
                                <div className="flex justify-between items-start gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-1">
                                            <span className="font-semibold text-lg">
                                                {b.title}
                                            </span>
                                            <span className="text-xs text-gray-500">
                                                📍 Area {b.area_id}
                                            </span>
                                        </div>
                                        <p className="text-gray-700 mb-2">{b.content}</p>
                                        <p className="text-sm text-gray-500">
                                            👤{" "}
                                            {b.is_anonymous
                                                ? "Anonymous"
                                                : `User ${b.user_id}`}{" "}
                                            · {new Date(b.created_at).toLocaleString()}
                                        </p>
                                    </div>

                                    {b.user_id === currentUserId && (
                                        <button
                                            onClick={() => handleDelete(b.broadcast_id)}
                                            className="text-red-500 hover:text-red-700 text-sm px-2 py-1 rounded-lg bg-red-50"
                                        >
                                            🗑
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* + 创建广播按钮 */}
                {!isWriting && (
                    <div className="text-center mt-8">
                        <button
                            onClick={() => setIsWriting(true)}
                            className="px-6 py-2 bg-indigo-600 text-white rounded-full shadow hover:bg-indigo-700 transition"
                        >
                            + Add Broadcast
                        </button>
                    </div>
                )}

                {/* 创建广播表单 */}
                {isWriting && (
                    <div className="bg-gray-100 p-6 rounded-xl mt-8 space-y-4">
                        <div>
                            <label className="block mb-1 text-sm text-gray-600">
                                Choose Area:
                            </label>
                            <select
                                value={postAreaId}
                                onChange={(e) =>
                                    setPostAreaId(
                                        e.target.value === "" ? "" : Number(e.target.value)
                                    )
                                }
                                className="w-full p-3 border rounded-lg"
                            >
                                <option value="">-- Select an Area --</option>
                                {areaList.map((a) => (
                                    <option key={a.area_id} value={a.area_id}>
                                        {a.name} (Floor {a.floor})
                                    </option>
                                ))}
                            </select>
                        </div>

                        <input
                            type="text"
                            placeholder="Title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full p-3 rounded-lg border border-gray-300"
                        />

                        <textarea
                            rows={4}
                            placeholder="Describe your broadcast..."
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            className="w-full p-3 rounded-lg border border-gray-300"
                        />

                        <label className="flex items-center">
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
                                type="button"
                                onClick={handleSubmit}
                                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                            >
                                Submit
                            </button>

                            <button
                                type="button"
                                onClick={() => {
                                    setIsWriting(false);
                                    setTitle("");
                                    setContent("");
                                    setIsAnonymous(false);
                                    setPostAreaId("");
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
    );
}
