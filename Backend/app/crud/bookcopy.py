from sqlalchemy.orm import Session
from app.models.bookcopy import BookCopy
from app.schemas.bookcopy import BookCopyCreate, BookCopyUpdate

def get_bookcopies_by_shelf(db: Session, shelf_id: int):
    return db.query(BookCopy).filter(BookCopy.shelf_id == shelf_id).all()


def create_bookcopy(db: Session, data: BookCopyCreate):
    bc = BookCopy(**data.dict())
    db.add(bc)
    db.commit()
    db.refresh(bc)
    return bc


def get_bookcopy(db: Session, copy_id: int):
    return db.query(BookCopy).filter(BookCopy.copy_id == copy_id).first()


def get_bookcopies_by_book(db: Session, book_id: int):
    return db.query(BookCopy).filter(BookCopy.book_id == book_id).all()


def update_bookcopy(db: Session, copy_id: int, data: BookCopyUpdate):
    bc = get_bookcopy(db, copy_id)
    if not bc:
        return None
    for key, value in data.dict(exclude_unset=True).items():
        setattr(bc, key, value)
    db.commit()
    db.refresh(bc)
    return bc


def delete_bookcopy(db: Session, copy_id: int):
    bc = get_bookcopy(db, copy_id)
    if not bc:
        return None
    db.delete(bc)
    db.commit()
    return True
