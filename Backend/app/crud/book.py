from sqlalchemy.orm import Session
from app.models.book import Book
from app.schemas.book import BookCreate, BookUpdate
from sqlalchemy import func
from datetime import datetime
from app.models.borrowrecord import BorrowRecord
from app.models.bookcopy import BookCopy


# List all books
def list_books(db: Session):
    return db.query(Book).all()


# Create
def create_book(db: Session, data: BookCreate):
    db_book = Book(**data.dict())
    db.add(db_book)
    db.commit()
    db.refresh(db_book)
    return db_book


# Read by ID
def get_book(db: Session, book_id: int):
    return db.query(Book).filter(Book.book_id == book_id).first()


# Update
def update_book(db: Session, book_id: int, data: BookUpdate):
    db_book = get_book(db, book_id)
    if not db_book:
        return None

    for attr, value in data.dict(exclude_unset=True).items():
        setattr(db_book, attr, value)

    db.commit()
    db.refresh(db_book)
    return db_book


# Delete
def delete_book(db: Session, book_id: int):
    db_book = get_book(db, book_id)
    if not db_book:
        return None

    db.delete(db_book)
    db.commit()
    return True

# Search
def search_books(db: Session, keyword: str):
    keyword = f"%{keyword}%"
    return (
        db.query(Book)
        .filter(Book.title.ilike(keyword))
        .all()
    )
def get_monthly_top_books(db: Session, limit: int = 10):
    # 本月第一天（按 UTC，可根据需要改成本地时间）
    now = datetime.utcnow()
    first_day = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)

    q = (
        db.query(
            Book,
            func.count(BorrowRecord.record_id).label("borrow_count"),
        )
        .join(BookCopy, Book.book_id == BookCopy.book_id)
        .join(BorrowRecord, BorrowRecord.copy_id == BookCopy.copy_id)
        .filter(BorrowRecord.borrow_date >= first_day)
        .group_by(Book.book_id)
        .order_by(func.count(BorrowRecord.record_id).desc())
        .limit(limit)
    )

    return q.all()
