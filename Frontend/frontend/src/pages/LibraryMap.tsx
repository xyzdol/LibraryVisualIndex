// src/pages/LibraryMap.tsx
import { useEffect, useMemo, useRef, useState } from "react";
import Navbar from "../components/Navbar";
import { getShelfMap, type ShelfMapItem } from "../api/shelves";
import { useNavigate, useSearchParams } from "react-router-dom";

function groupByFloor(items: ShelfMapItem[]): Record<number, ShelfMapItem[]> {
    return items.reduce((acc, item) => {
        if (!acc[item.floor]) acc[item.floor] = [];
        acc[item.floor].push(item);
        return acc;
    }, {} as Record<number, ShelfMapItem[]>);
}

const areaColorClass: Record<number, string> = {
    1: "bg-red-100 border-red-400",
    2: "bg-blue-100 border-blue-400",
    3: "bg-green-100 border-green-400",
    4: "bg-yellow-100 border-yellow-400",
    5: "bg-purple-100 border-purple-400",
    6: "bg-pink-100 border-pink-400",
};

export default function LibraryMap() {
    const [shelves, setShelves] = useState<ShelfMapItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    // ⭐ 从 URL 读取要高亮的 shelf_id
    const highlightedShelfId = Number(searchParams.get("shelf") || 0);

    const shelfRefs = useRef<Record<number, HTMLButtonElement | null>>({});

    useEffect(() => {
        async function load() {
            try {
                const data = await getShelfMap();
                setShelves(data);
            } catch (err) {
                console.error(err);
                setError("Failed to load library map.");
            } finally {
                setLoading(false);
            }
        }
        load();
    }, []);

    const byFloor = useMemo(() => groupByFloor(shelves), [shelves]);

    // ⭐ 自动滚动到被高亮的 shelf
    useEffect(() => {
        if (!highlightedShelfId) return;
        const el = shelfRefs.current[highlightedShelfId];
        if (el) {
            el.scrollIntoView({
                behavior: "smooth",
                block: "center",
            });
        }
    }, [highlightedShelfId, shelves]);

    const highlightedShelf = useMemo(
        () => shelves.find((s) => s.shelf_id === highlightedShelfId),
        [shelves, highlightedShelfId]
    );

    if (loading) {
        return (
            <div>
                <Navbar />
                <div className="pt-24 text-center text-gray-500 text-xl">
                    Loading map...
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div>
                <Navbar />
                <div className="pt-24 text-center text-red-500 text-xl">
                    {error}
                </div>
            </div>
        );
    }

    return (
        <div>
            <Navbar />

            <div className="pt-24 px-8 max-w-6xl mx-auto">
                <h1 className="text-4xl font-bold text-gray-900 mb-3">Library 2D Map</h1>
                <p className="text-gray-500 mb-4">Click a shelf to view the books on it.</p>

                {/* ⭐ 顶部提示 */}
                {highlightedShelf && (
                    <div className="mb-4 rounded-xl bg-indigo-50 border border-indigo-200 px-4 py-3 text-sm text-indigo-800">
                        Highlighting shelf <b>{highlightedShelf.code}</b> ({highlightedShelf.area_name}, Floor {highlightedShelf.floor})
                    </div>
                )}

                {Object.entries(byFloor)
                    .sort((a, b) => Number(a[0]) - Number(b[0]))
                    .map(([floorStr, floorShelves]) => {
                        const floor = Number(floorStr);
                        const maxX = Math.max(...floorShelves.map((s) => s.pos_x));
                        const maxY = Math.max(...floorShelves.map((s) => s.pos_y));

                        return (
                            <div key={floor} className="mb-10">
                                <h2 className="text-2xl font-semibold mb-3">Floor {floor}</h2>

                                <div className="relative border rounded-2xl p-4 bg-gray-50">
                                    <div
                                        className="grid gap-3"
                                        style={{
                                            gridTemplateColumns: `repeat(${maxX}, minmax(0, 1fr))`,
                                            gridTemplateRows: `repeat(${maxY}, minmax(60px, auto))`,
                                        }}
                                    >
                                        {floorShelves.map((shelf) => {
                                            const colorClass =
                                                areaColorClass[shelf.area_id] ||
                                                "bg-white border-gray-300";

                                            const isHighlighted =
                                                shelf.shelf_id === highlightedShelfId;

                                            return (
                                                <button
                                                    key={shelf.shelf_id}
                                                    ref={(el: HTMLButtonElement | null) => {
                                                        shelfRefs.current[shelf.shelf_id] = el;
                                                    }}

                                                    style={{
                                                        gridColumn: shelf.pos_x,
                                                        gridRow: shelf.pos_y,
                                                    }}
                                                    className={`border ${colorClass} rounded-xl px-2 py-2 text-sm flex flex-col items-start justify-center transition
                                                    hover:shadow-md hover:-translate-y-0.5
                                                    ${
                                                        isHighlighted
                                                            ? "ring-4 ring-indigo-500 animate-pulse"
                                                            : ""
                                                    }`}
                                                    onClick={() =>
                                                        navigate(`/books?shelf=${shelf.shelf_id}`)
                                                    }
                                                >
                                                    <span className="font-semibold">{shelf.code}</span>
                                                    <span className="text-xs text-gray-600">
                                                        {shelf.area_name}
                                                    </span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
            </div>
        </div>
    );
}
