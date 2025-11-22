from sqlalchemy.orm import Session
from datetime import datetime
from app.models.borrowrecord import BorrowRecord
from app.models.bookcopy import BookCopy
from app.schemas.borrowrecord import BorrowRecordCreate, BorrowRecordUpdate


# 借书
def borrow_book(db: Session, data: BorrowRecordCreate):
    copy = db.query(BookCopy).filter(BookCopy.copy_id == data.copy_id).first()

    if not copy:
        return None, "Book copy does not exist"

    if copy.status == "borrowed":
        return None, "Book copy is already borrowed"

    # 更新副本状态
    copy.status = "borrowed"

    record = BorrowRecord(
        copy_id=data.copy_id,
        user_id=data.user_id,
        borrow_date=datetime.now(),
        status=data.status
    )
    db.add(record)
    db.commit()
    db.refresh(record)
    return record, None


# 还书
def return_book(db: Session, record_id: int):
    record = db.query(BorrowRecord).filter(BorrowRecord.record_id == record_id).first()
    if not record:
        return None

    # 改 status
    record.return_date = datetime.now()
    record.status = "returned"

    # 同时解锁书籍
    copy = db.query(BookCopy).filter(BookCopy.copy_id == record.copy_id).first()
    if copy:
        copy.status = "available"

    db.commit()
    db.refresh(record)
    return record


# 查询记录
def get_record(db: Session, record_id: int):
    return db.query(BorrowRecord).filter(BorrowRecord.record_id == record_id).first()


def list_records(db: Session):
    return db.query(BorrowRecord).all()
