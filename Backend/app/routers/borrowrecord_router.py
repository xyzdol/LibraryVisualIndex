from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.schemas.borrowrecord import BorrowRecordCreate, BorrowRecordOut
from app.crud import borrowrecord as crud_borrowrecord

router = APIRouter(prefix="/records", tags=["Borrow Records"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/", response_model=BorrowRecordOut)
def create_borrow_record(data: BorrowRecordCreate, db: Session = Depends(get_db)):
    record, err = crud_borrowrecord.borrow_book(db, data)
    if err:
        raise HTTPException(status_code=400, detail=err)
    return record


@router.put("/{record_id}/return", response_model=BorrowRecordOut)
def return_borrowed_book(record_id: int, db: Session = Depends(get_db)):
    record = crud_borrowrecord.return_book(db, record_id)
    if not record:
        raise HTTPException(status_code=404, detail="Record not found")
    return record


@router.get("/{record_id}", response_model=BorrowRecordOut)
def read_record(record_id: int, db: Session = Depends(get_db)):
    record = crud_borrowrecord.get_record(db, record_id)
    if not record:
        raise HTTPException(status_code=404, detail="Record not found")
    return record


@router.get("/", response_model=list[BorrowRecordOut])
def read_records(db: Session = Depends(get_db)):
    return crud_borrowrecord.list_records(db)


# ===============================
# 用户借阅书籍（只返回未归还的）
# ===============================
@router.get("/user/{user_id}/borrowed_books")
def user_borrowed_books(user_id: int, db: Session = Depends(get_db)):

    # ⭐ 只查询未归还 borrowed 状态！
    records = (
        db.query(crud_borrowrecord.BorrowRecord)
        .join(crud_borrowrecord.BookCopy)
        .filter(
            crud_borrowrecord.BorrowRecord.user_id == user_id,
            crud_borrowrecord.BorrowRecord.status == "borrowed",
            crud_borrowrecord.BookCopy.status == "borrowed",
        )
        .all()
    )

    result = []
    for r in records:
        result.append(
            {
                "record_id": r.record_id,
                "borrow_date": r.borrow_date,
                "return_date": r.return_date,
                "status": r.status,
                "book": {
                    "title": r.book_copy.book.title,
                    "author": r.book_copy.book.author,
                    "cover_image_url": r.book_copy.book.cover_image_url,
                    "publish_year": r.book_copy.book.publish_year,
                    "summary": r.book_copy.book.summary,
                },
                "copy": {
                    "copy_id": r.copy_id,
                    "due_date": r.book_copy.due_date,
                    "status": r.book_copy.status,
                },
            }
        )

    return result
