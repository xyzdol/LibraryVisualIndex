from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class BorrowRecordBase(BaseModel):
    copy_id: int
    user_id: int
    status: str


class BorrowRecordCreate(BorrowRecordBase):
    pass


class BorrowRecordUpdate(BaseModel):
    return_date: Optional[datetime] = None
    status: Optional[str] = None


class BorrowRecordOut(BorrowRecordBase):
    record_id: int
    borrow_date: datetime
    return_date: Optional[datetime]

    class Config:
        from_attributes = True
