import http from "./http.ts";

export async function getShelvesByArea(area_id: number) {
    return await http.get(`/shelves?area_id=${area_id}`);
}
