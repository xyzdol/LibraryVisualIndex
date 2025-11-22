from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import SessionLocal
from app.schemas.book import BookCreate, BookOut, BookUpdate
from app.crud import book as crud_book


router = APIRouter()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


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
