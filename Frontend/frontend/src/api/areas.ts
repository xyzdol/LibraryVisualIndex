import http from "./http.ts";

export async function getAreas() {
    const res = await http.get("/areas");
    return res;
}