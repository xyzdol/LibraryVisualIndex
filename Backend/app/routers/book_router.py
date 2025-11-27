from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session


from app.database import SessionLocal
from app.schemas.book import BookCreate, BookOut, BookUpdate, BookWithCount
from app.crud import book as crud_book
from app.models.bookcopy import BookCopy




router = APIRouter()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/search", response_model=list[BookOut])
def search_books(keyword: str, db: Session = Depends(get_db)):
    if not keyword.strip():
        return []
    return crud_book.search_books(db, keyword)

@router.get("/ranking/month", response_model=list[BookWithCount])
def monthly_ranking(limit: int = 10, db: Session = Depends(get_db)):
    rows = crud_book.get_monthly_top_books(db, limit=limit)
    result: list[BookWithCount] = []

    for book, borrow_count in rows:
        result.append(
            BookWithCount(
                book_id=book.book_id,
                title=book.title,
                author=book.author,
                publisher=book.publisher,
                isbn=book.isbn,
                category_id=book.category_id,
                summary=book.summary,
                publish_year=book.publish_year,
                cover_image_url=book.cover_image_url,
                borrow_count=borrow_count,
            )
        )

    return result


# List all books
@router.get("/", response_model=list[BookOut])
def list_books(db: Session = Depends(get_db)):
    return crud_book.list_books(db)


# Create book
@router.post("/", response_model=BookOut)
def create_book(data: BookCreate, db: Session = Depends(get_db)):
    return crud_book.create_book(db, data)


# Get book by ID
@router.get("/{book_id}", response_model=BookOut)
def read_book(book_id: int, db: Session = Depends(get_db)):
    book = crud_book.get_book(db, book_id)
    if not book:
        raise HTTPException(status_code=404, detail="Book not found")
    return book


# Update
@router.put("/{book_id}", response_model=BookOut)
def update_book(book_id: int, data: BookUpdate, db: Session = Depends(get_db)):
    updated = crud_book.update_book(db, book_id, data)
    if not updated:
        raise HTTPException(status_code=404, detail="Book not found")
    return updated


# Delete
@router.delete("/{book_id}")
def delete_book(book_id: int, db: Session = Depends(get_db)):
    result = crud_book.delete_book(db, book_id)
    if not result:
        raise HTTPException(status_code=404, detail="Book not found")
    return {"ok": True}


@router.get("/{book_id}/first_available_copy")
def get_first_available_copy(book_id: int, db: Session = Depends(get_db)):

    copy = (
        db.query(BookCopy)
        .filter(BookCopy.book_id == book_id, BookCopy.status == "available")
        .order_by(BookCopy.copy_id)
        .first()
    )

    if not copy:
        return None

    return {
        "copy_id": copy.copy_id,
        "shelf_id": copy.shelf_id,
        "status": copy.status,
        "due_date": copy.due_date,
    }

@router.get("/{book_id}/stats")
def get_book_stats(book_id: int, db: Session = Depends(get_db)):
    """
    返回：总数、可借数量、已借数量、最早归还日期
    """
    # 1. 查询所有副本
    copies = (
        db.query(BookCopy)
        .filter(BookCopy.book_id == book_id)
        .all()
    )

    if not copies:
        return {
            "total": 0,
            "available": 0,
            "borrowed": 0,
            "next_return_date": None,
        }

    total = len(copies)
    available = sum(1 for c in copies if c.status == "available")
    borrowed = total - available

    # 2. 计算最早归还日期（due_date 最小）
    due_dates = [c.due_date for c in copies if c.due_date]
    next_return_date = min(due_dates) if due_dates else None

    return {
        "total": total,
        "available": available,
        "borrowed": borrowed,
        "next_return_date": next_return_date,
    }
