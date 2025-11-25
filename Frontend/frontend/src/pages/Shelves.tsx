// src/pages/Shelves.tsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { getShelvesByArea } from "../api/shelves";
import type { ShelfOut } from "../api/shelves";

export default function Shelves() {
    const { area_id } = useParams();
    const navigate = useNavigate();
    const [shelves, setShelves] = useState<ShelfOut[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function load() {
            if (!area_id) return;

            const data = await getShelvesByArea(Number(area_id));
            setShelves(data);
            setLoading(false);
        }
        load();
    }, [area_id]);

    if (loading) {
        return (
            <div>
                <Navbar />
                <div className="pt-24 text-center text-gray-500 text-xl">
                    Loading shelves...
                </div>
            </div>
        );
    }

    return (
        <div>
            <Navbar />
            <div className="pt-24 px-8 max-w-6xl mx-auto">
                <h1 className="text-3xl font-bold mb-6">
                    Shelves in Area #{area_id}
                </h1>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {shelves.map((shelf) => (
                        <button
                            key={shelf.shelf_id}
                            className="bg-white rounded-xl shadow-md p-4 hover:shadow-lg transition"
                            onClick={() =>
                                navigate(`/books?shelf=${shelf.shelf_id}`)
                            }
                        >
                            <h2 className="text-xl font-semibold">{shelf.code}</h2>
                            <p className="text-gray-600 text-sm mt-1">
                                {shelf.description || "No description"}
                            </p>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
