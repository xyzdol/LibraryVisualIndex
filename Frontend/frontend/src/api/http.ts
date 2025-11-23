const BASE_URL = "http://127.0.0.1:8000";

const http = {
    async get(path: string) {
        const res = await fetch(BASE_URL + path);

        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }

        return res.json();
    },
};

export default http;
