from pydantic import BaseModel
from datetime import date

class BookCopyBase(BaseModel):
    book_id: int
    shelf_id: int
    barcode: str
    status: str
    due_date: date | None = None


class BookCopyCreate(BookCopyBase):
    pass


class BookCopyUpdate(BaseModel):
    shelf_id: int | None = None
    status: str | None = None
    due_date: date | None = None


class BookCopyOut(BookCopyBase):
    copy_id: int

    class Config:
        from_attributes = True
