from sqlalchemy.orm import Session
from app.models.book import Book
from app.schemas.book import BookCreate, BookUpdate


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
