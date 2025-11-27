// src/api/http.ts
export interface HttpClient {
    get<T>(path: string): Promise<T>;
    post<T, B = unknown>(path: string, body?: B): Promise<T>;
    put<T, B = unknown>(path: string, body?: B): Promise<T>;
    delete<T>(path: string): Promise<T>;
}

const BASE_URL = "http://127.0.0.1:8000";

async function request<T, B = unknown>(
    method: string,
    path: string,
    body?: B
): Promise<T> {
    const res = await fetch(BASE_URL + path, {
        method,
        headers: { "Content-Type": "application/json" },
        body: body === undefined ? undefined : JSON.stringify(body),
    });

    if (!res.ok) {
        const error = await res.text();
        throw new Error(error || `HTTP ${res.status}`);
    }

    return res.json() as Promise<T>;
}

const http: HttpClient = {
    get:  <T>(path: string)               => request<T>("GET", path),
    post: <T, B = unknown>(path: string, body?: B) =>
        request<T, B>("POST", path, body),
    put:  <T, B = unknown>(path: string, body?: B) =>
        request<T, B>("PUT", path, body),
    delete: <T>(path: string)             => request<T>("DELETE", path),
};

export default http;
