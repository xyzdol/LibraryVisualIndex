// src/api/auth.ts
import http from "./http";

export async function apiRegister(data: {
    username: string;
    password: string;
    real_name?: string;
}) {
    return await http.post("/auth/register", data);
}

export async function apiLogin(data: {
    username: string;
    password: string;
}) {
    return await http.post("/auth/login", data);
}
