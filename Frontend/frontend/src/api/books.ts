// src/api/books.ts
import http from "./http";

export interface BookBase {
    book_id: number;
    title: string;
    author: string | null;
    summary: string | null;
    publish_year: number | null;
    cover_image_url: string | null;
    publisher?: string | null;
    isbn?: string | null;
}

export interface BookDetailInfo extends BookBase {
    publisher: string | null;
    isbn: string | null;
}

export interface BookCopyWithBook {
    copy_id: number;
    status: string;
    due_date: string | null;
    book: BookBase;
}

export interface RankedBook extends BookBase {
    category_id: number;
    publisher: string | null;
    isbn: string | null;
    borrow_count: number;
}

/* 补充 shelf_id ——关键！跳到地图时必须有 */
export interface FirstAvailableCopy {
    copy_id: number;
    shelf_id: number;     // ★ 新增
    status: string;
    due_date: string | null;
}

// 获取货架上的副本
export async function getBooksByShelf(
    shelfId: number
): Promise<BookCopyWithBook[]> {
    return http.get<BookCopyWithBook[]>(`/bookcopies/by-shelf/${shelfId}`);
}

// 书籍详情
export async function getBookDetail(
    bookId: number
): Promise<BookDetailInfo> {
    return http.get<BookDetailInfo>(`/books/${bookId}`);
}

// 搜索
export async function searchBooks(keyword: string): Promise<BookBase[]> {
    return http.get<BookBase[]>(
        `/books/search?keyword=${encodeURIComponent(keyword)}`
    );
}

// 每月排行榜
export async function getMonthlyRanking(
    limit: number = 10
): Promise<RankedBook[]> {
    return http.get<RankedBook[]>(`/books/ranking/month?limit=${limit}`);
}

// ★ 获取某本书第一本可借的副本（含 shelf_id）
export async function getFirstAvailableCopy(
    bookId: number
): Promise<FirstAvailableCopy | null> {
    return http.get<FirstAvailableCopy | null>(
        `/books/${bookId}/first_available_copy`
    );
}
