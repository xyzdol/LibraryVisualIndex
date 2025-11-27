// src/api/comments.ts
import http from "./http";

export interface CommentOut {
    comment_id: number;
    book_id: number;
    user_id: number | null;
    content: string;
    is_anonymous: boolean;
    created_at: string;
}

export interface CommentCreate {
    book_id: number;
    user_id: number;
    content: string;
    is_anonymous: boolean;
}

export async function createComment(data: CommentCreate): Promise<CommentOut> {
    return http.post<CommentOut>("/comments", data);
}

export async function getComments(bookId: number): Promise<CommentOut[]> {
    return http.get<CommentOut[]>(`/comments/book/${bookId}`);
}

export async function deleteComment(
    commentId: number
): Promise<{ message: string }> {
    return http.delete<{ message: string }>(`/comments/${commentId}`);
}
