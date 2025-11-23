// src/api/http.ts
const BASE_URL = "http://127.0.0.1:8000";

const http = {
    async get(path: string) {
        const res = await fetch(BASE_URL + path);
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
    },

    async post(path: string, body: any) {
        const res = await fetch(BASE_URL + path, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        });
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
    }
};

export default http;
