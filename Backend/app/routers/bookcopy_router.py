from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.schemas.bookcopy import BookCopyCreate, BookCopyOut, BookCopyUpdate
from app.crud import bookcopy as crud

router = APIRouter(prefix="/bookcopies", tags=["BookCopy"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/by-shelf/{shelf_id}")
def get_books_by_shelf(shelf_id: int, db: Session = Depends(get_db)):
    copies = crud.get_bookcopies_by_shelf(db, shelf_id)
    result = []
    for c in copies:
        result.append({
            "copy_id": c.copy_id,
            "status": c.status,
            "due_date": c.due_date,
            "book": {
                "book_id": c.book.book_id,
                "title": c.book.title,
                "author": c.book.author,
                "summary": c.book.summary,
                "publish_year": c.book.publish_year,
                "cover_image_url": c.book.cover_image_url,
            }
        })
    return result


@router.post("/", response_model=BookCopyOut)
def create_bookcopy(data: BookCopyCreate, db: Session = Depends(get_db)):
    return crud.create_bookcopy(db, data)


@router.get("/{copy_id}", response_model=BookCopyOut)
def read_bookcopy(copy_id: int, db: Session = Depends(get_db)):
    bc = crud.get_bookcopy(db, copy_id)
    if not bc:
        raise HTTPException(status_code=404, detail="Book copy not found")
    return bc


@router.put("/{copy_id}", response_model=BookCopyOut)
def update_bookcopy(copy_id: int, data: BookCopyUpdate, db: Session = Depends(get_db)):
    bc = crud.update_bookcopy(db, copy_id, data)
    if not bc:
        raise HTTPException(status_code=404, detail="Book copy not found")
    return bc


@router.delete("/{copy_id}")
def delete_bookcopy(copy_id: int, db: Session = Depends(get_db)):
    success = crud.delete_bookcopy(db, copy_id)
    if not success:
        raise HTTPException(status_code=404, detail="Book copy not found")
    return {"message": "deleted"}
