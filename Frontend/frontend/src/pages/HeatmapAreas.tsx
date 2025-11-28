import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAreas } from "../api/areas";
import Navbar from "../components/Navbar";

interface Area {
    area_id: number;
    name: string;
    floor: number;
    description: string;
    visit_count?: number;
}

export default function HeatmapAreas() {
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

    if (loading) {
        return <div className="pt-24 text-center text-gray-500 text-xl">Loading...</div>;
    }

    const maxVisit = Math.max(...areas.map((a) => a.visit_count || 0), 1);

    // ⭐ 完整热力色板
    function getHeatColor(vc: number | undefined) {
        const v = vc ?? 0;
        const ratio = v / maxVisit;
        if (ratio < 0.25) return "bg-green-400";
        if (ratio < 0.5) return "bg-yellow-400";
        if (ratio < 0.75) return "bg-orange-500";
        return "bg-red-600";
    }

    return (
        <div>
            <Navbar />

            <div className="pt-24 p-8">

                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-4xl font-bold">Library Area Heatmap</h1>

                    <button
                        onClick={() => navigate("/areas")}
                        className="px-4 py-2 bg-gray-700 text-white rounded-xl hover:bg-gray-800 transition"
                    >
                        Back to Normal View
                    </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {areas.map((area) => (
                        <div
                            key={area.area_id}
                            className={`cursor-pointer p-6 text-white rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-1 transition ${getHeatColor(
                                area.visit_count
                            )}`}
                        >
                            <h2 className="text-2xl font-semibold">{area.name}</h2>
                            <p className="text-sm mt-2">Floor: {area.floor}</p>
                            <p className="text-sm opacity-80">{area.description}</p>
                            <p className="mt-2 text-xs text-white/90">
                                Visits: {area.visit_count ?? 0}
                            </p>
                        </div>
                    ))}
                </div>

            </div>
        </div>
    );
}
