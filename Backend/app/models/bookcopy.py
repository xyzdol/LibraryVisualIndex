from sqlalchemy import Column, Integer, String, Date, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base


class BookCopy(Base):
    __tablename__ = "bookcopy"

    copy_id = Column(Integer, primary_key=True, autoincrement=True)
    book_id = Column(Integer, ForeignKey("book.book_id"), nullable=False)
    shelf_id = Column(Integer, ForeignKey("shelf.shelf_id"), nullable=False)
    barcode = Column(String(50), nullable=False)
    status = Column(String(20), nullable=False)
    due_date = Column(Date)

    # relationships
    book = relationship("Book", back_populates="book_copies")
    shelf = relationship("Shelf", back_populates="book_copies")
    borrow_records = relationship("BorrowRecord", back_populates="book_copy")
