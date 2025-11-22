from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.schemas.borrowrecord import BorrowRecordCreate, BorrowRecordOut
from app.crud.borrowrecord import borrow_book, return_book, get_record, list_records

router = APIRouter(prefix="/records", tags=["Borrow Records"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# 借书
@router.post("/", response_model=BorrowRecordOut)
def create_borrow_record(data: BorrowRecordCreate, db: Session = Depends(get_db)):
    record, err = borrow_book(db, data)
    if err:
        raise HTTPException(status_code=400, detail=err)
    return record


# 还书
@router.put("/{record_id}/return", response_model=BorrowRecordOut)
def return_borrowed_book(record_id: int, db: Session = Depends(get_db)):
    record = return_book(db, record_id)
    if not record:
        raise HTTPException(status_code=404, detail="Record not found")
    return record


# 查询单条
@router.get("/{record_id}", response_model=BorrowRecordOut)
def read_record(record_id: int, db: Session = Depends(get_db)):
    record = get_record(db, record_id)
    if not record:
        raise HTTPException(status_code=404, detail="Record not found")
    return record


# 查询全部
@router.get("/", response_model=list[BorrowRecordOut])
def read_records(db: Session = Depends(get_db)):
    return list_records(db)
