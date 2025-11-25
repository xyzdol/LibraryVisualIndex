import http from "./http";
// import type { ShelfOut } from "./types";

export interface ShelfOut {
    shelf_id: number;
    area_id: number;
    code: string;
    pos_x: number;
    pos_y: number;
    description: string | null;
}

export async function getShelvesByArea(areaId: number): Promise<ShelfOut[]> {
    return http.get<ShelfOut[]>(`/shelves?area_id=${areaId}`);
}

export interface ShelfMapItem {
    shelf_id: number;
    area_id: number;
    code: string;
    pos_x: number;
    pos_y: number;
    description: string | null;
    area_name: string;
    floor: number;
}

export async function getShelfMap(): Promise<ShelfMapItem[]> {
    return http.get<ShelfMapItem[]>("/shelves/map");
}
