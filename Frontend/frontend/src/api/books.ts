import http from "./http.ts";

export async function getBooksByShelf(shelfId: number) {
    return await http.get(`/bookcopies/by-shelf/${shelfId}`);
}

export async function getBookDetail(bookId: number) {
    return await http.get(`/books/${bookId}`);
}
