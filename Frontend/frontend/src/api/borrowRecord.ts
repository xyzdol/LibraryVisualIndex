// src/api/borrowRecord.ts
import http from "./http";

export interface BorrowRecordResponse {
    record_id: number;
    borrow_date: string;
    return_date: string | null;
    status: string;
}

export interface BorrowedRecordWithBook {
    record_id: number;
    borrow_date: string;
    return_date: string | null;
    status: string;
    book: {
        title: string;
        author: string | null;
        cover_image_url: string | null;
        publish_year: number | null;
        summary: string | null;
    };
    copy: {
        copy_id: number;
        due_date: string | null;
        status: string;
    };
}

// 借书
export async function borrowBook(
    copyId: number,
    userId: number
): Promise<BorrowRecordResponse> {
    return http.post<
        BorrowRecordResponse,
        { copy_id: number; user_id: number; status: string }
    >("/records", {
        copy_id: copyId,
        user_id: userId,
        status: "borrowed",
    });
}

// 还书
export async function returnBook(
    recordId: number
): Promise<BorrowRecordResponse> {
    return http.put<BorrowRecordResponse>(`/records/${recordId}/return`);
}

// 某用户的借阅记录（带图书信息）
export async function getUserBorrowedBooks(
    userId: number
): Promise<BorrowedRecordWithBook[]> {
    return http.get<BorrowedRecordWithBook[]>(
        `/records/user/${userId}/borrowed_books`
    );
}
