import { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { getShelvesByArea } from "../api/shelves.ts";
import Navbar from "../components/Navbar";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

interface Shelf {
    shelf_id: number;
    area_id: number;
    code: string;
    pos_x: number;
    pos_y: number;
    description: string | null;
}

export default function Shelves() {
    const navigate = useNavigate();
    const { area_id } = useParams();
    const [searchParams] = useSearchParams();
    const areaName = searchParams.get("name") || "Area";

    const [shelves, setShelves] = useState<Shelf[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function load() {
            const id = Number(area_id);
            const data = await getShelvesByArea(id);
            setShelves(data);
            setLoading(false);
        }
        load();
    }, [area_id]);

    if (loading) {
        return <div className="text-center p-10 text-gray-500 text-xl">Loading...</div>;
    }

    return (
        <div>
            <Navbar />
            <div className="pt-24 p-8">

                {/* Back button */}
                <button
                    onClick={() => navigate("/areas")}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200
                    rounded-xl shadow-sm mb-6 transition"
                >
                    <ArrowLeftIcon className="h-5 w-5 text-gray-600" />
                    Back to Areas
                </button>

                <h1 className="text-4xl font-bold text-gray-900 mb-6">
                    Shelves in {areaName}
                </h1>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {shelves.map(shelf => (
                        <div
                            key={shelf.shelf_id}
                            className="p-6 bg-white shadow-md rounded-xl border border-gray-100 hover:shadow-lg
                                       hover:-translate-y-1 transition cursor-pointer"
                            onClick={() => navigate(`/books?shelf=${shelf.shelf_id}`)}
                        >
                            <h2 className="text-xl font-semibold text-gray-900">
                                Shelf {shelf.code}
                            </h2>

                            <p className="mt-2 text-gray-600 text-sm">
                                Position: ({shelf.pos_x}, {shelf.pos_y})
                            </p>

                            {shelf.description && (
                                <p className="mt-1 text-gray-500 text-sm">
                                    {shelf.description}
                                </p>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
