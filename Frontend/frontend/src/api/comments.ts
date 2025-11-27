// src/api/comments.ts
import http from "./http";

export interface CommentOut {
    comment_id: number;
    book_id: number;
    user_id: number | null;   // 匿名为 null
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

// 创建评论
export async function createComment(data: CommentCreate): Promise<CommentOut> {
    return http.post<CommentOut>("/comments", data);
}

// 获取该书全部评论
export async function getComments(bookId: number): Promise<CommentOut[]> {
    return http.get<CommentOut[]>(`/comments/book/${bookId}`);
}

// 删除评论（可选）
export async function deleteComment(commentId: number) {
    return http.delete(`/comments/${commentId}`);
}
