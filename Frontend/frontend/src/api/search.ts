import http from "./http";

export async function searchBooks(keyword: string) {
    return await http.get(`/books/search?keyword=${encodeURIComponent(keyword)}`);
}
