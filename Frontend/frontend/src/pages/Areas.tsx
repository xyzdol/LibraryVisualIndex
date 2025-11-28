// src/pages/Areas.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAreas } from "../api/areas";
import Navbar from "../components/Navbar";

const BASE_URL = "http://127.0.0.1:8000";

interface Area {
    area_id: number;
    name: string;
    floor: number;
    description: string;
    visit_count?: number;
}

export default function Areas() {
    const [areas, setAreas] = useState<Area[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        async function load() {
            const list = await getAreas();
            setAreas(list as Area[]);
            setLoading(false);
        }
        load();
    }, []);

    async function handleEnter(areaId: number, name: string) {
        try {
            await fetch(`${BASE_URL}/areas/${areaId}/visit`, { method: "POST" });
        } catch {}

        navigate(`/shelves/${areaId}?name=${name}`);
    }

    if (loading) {
        return (
            <div>
                <Navbar />
                <div className="pt-24 text-center text-gray-500 text-xl">
                    Loading...
                </div>
            </div>
        );
    }

    const maxVisit = Math.max(...areas.map((a) => a.visit_count || 0), 1);

    function getHeatOverlay(visits: number | undefined) {
        const v = visits || 0;
        const ratio = v / maxVisit;
        if (ratio < 0.33) return "bg-white/0";
        if (ratio < 0.66) return "bg-yellow-200/25";
        return "bg-red-300/25";
    }

    const gradients = [
        "from-blue-500 to-indigo-500",
        "from-purple-500 to-pink-400",
        "from-teal-400 to-green-400",
        "from-orange-400 to-yellow-300",
        "from-rose-400 to-red-500",
        "from-indigo-400 to-purple-500",
    ];

    return (
        <div
            className="min-h-screen bg-cover bg-center"
            style={{
                backgroundImage: "url('/background/bkg3.jpg')",
            }}
        >
            <Navbar />

            <div className="pt-24 p-8 backdrop-blur-md bg-white/30 mx-6 rounded-3xl">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-4xl font-bold">Library Areas</h1>

                    <button
                        onClick={() => navigate("/areas/heatmap")}
                        className="px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition"
                    >
                        Heatmap View
                    </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {areas.map((area, idx) => (
                        <div
                            key={area.area_id}
                            onClick={() => handleEnter(area.area_id, area.name)}
                            className={`cursor-pointer relative p-6 text-white rounded-2xl bg-gradient-to-r ${
                                gradients[idx % gradients.length]
                            } shadow-md hover:shadow-xl hover:-translate-y-1 transition`}
                        >
                            <div
                                className={`absolute inset-0 rounded-2xl pointer-events-none ${getHeatOverlay(
                                    area.visit_count
                                )}`}
                            />

                            <h2 className="text-2xl font-semibold relative">{area.name}</h2>
                            <p className="text-sm mt-2 relative">Floor: {area.floor}</p>
                            <p className="text-sm opacity-80 relative">{area.description}</p>

                            <p className="mt-2 text-xs text-white/90 font-semibold relative">
                                Visits: {area.visit_count ?? 0}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
