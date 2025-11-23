import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAreas } from "../api/areas.ts";
import Navbar from "../components/Navbar";

interface Area {
    area_id: number;
    name: string;
    floor: number;
    description: string;
}

export default function Areas() {
    const [areas, setAreas] = useState<Area[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchAreas() {
            const res = await getAreas();
            setAreas(res);
            setLoading(false);
        }
        fetchAreas();
    }, []);

    if (loading) {
        return <div className="text-center p-10 text-gray-500 text-xl">Loading...</div>;
    }

    const gradients = [
        "from-blue-500 to-indigo-500",
        "from-purple-500 to-pink-400",
        "from-teal-400 to-green-400",
        "from-orange-400 to-yellow-300",
        "from-rose-400 to-red-500",
        "from-indigo-400 to-purple-500"
    ];

    return (
        <div>
            <Navbar />
            <div className="pt-24 p-8">

                <h1 className="text-4xl font-bold text-gray-900 mb-6">Library Areas</h1>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {areas.map((area, idx) => (
                        <div
                            key={area.area_id}
                            onClick={() =>
                                navigate(`/shelves/${area.area_id}?name=${area.name}`)
                            }
                            className={`cursor-pointer p-6 text-white rounded-2xl bg-gradient-to-r ${
                                gradients[idx % gradients.length]
                            } shadow-md hover:shadow-xl hover:-translate-y-1 transition`}
                        >
                            <h2 className="text-2xl font-semibold">{area.name}</h2>
                            <p className="text-sm mt-2">Floor: {area.floor}</p>
                            <p className="text-sm opacity-80">{area.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
