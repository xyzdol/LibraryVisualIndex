import http from "./http.ts";

export async function getBooksByShelf(shelfId: number) {
    return await http.get(`/bookcopies/by-shelf/${shelfId}`);
}

export async function getBookDetail(bookId: number) {
    return await http.get(`/books/${bookId}`);
}

export async function searchBooks(keyword: string) {
    return await http.get(`/books/search?keyword=${encodeURIComponent(keyword)}`);
}

export async function getMonthlyRanking(limit: number = 10) {
    return await http.get(`/books/ranking/month?limit=${limit}`);
}
