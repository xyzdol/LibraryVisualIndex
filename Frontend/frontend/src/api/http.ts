const BASE_URL = "http://127.0.0.1:8000";

// 通用 GET
export async function apiGet(path: string) {
    const res = await fetch(BASE_URL + path, {
        method: "GET",
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
}

// 通用 POST
export async function apiPost(path: string, body: any) {
    const res = await fetch(BASE_URL + path, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
}

// 通用 PUT
export async function apiPut(path: string, body: any) {
    const res = await fetch(BASE_URL + path, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
}

// 通用 DELETE
export async function apiDelete(path: string) {
    const res = await fetch(BASE_URL + path, {
        method: "DELETE",
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
}
