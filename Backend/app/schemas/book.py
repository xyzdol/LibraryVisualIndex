from pydantic import BaseModel
from typing import Optional


class BookBase(BaseModel):
    title: str
    author: Optional[str] = None
    publisher: Optional[str] = None
    isbn: Optional[str] = None
    category_id: int
    summary: Optional[str] = None
    publish_year: Optional[int] = None
    cover_image_url: Optional[str] = None


class BookCreate(BookBase):
    pass


class BookUpdate(BaseModel):
    title: Optional[str] = None
    author: Optional[str] = None
    publisher: Optional[str] = None
    isbn: Optional[str] = None
    category_id: Optional[int] = None
    summary: Optional[str] = None
    publish_year: Optional[int] = None
    cover_image_url: Optional[str] = None


class BookOut(BookBase):
    book_id: int

    class Config:
        from_attributes = True
