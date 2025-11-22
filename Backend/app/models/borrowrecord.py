from sqlalchemy import Column, Integer, DateTime, Date, String, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base


class BorrowRecord(Base):
    __tablename__ = "borrowrecord"

    record_id = Column(Integer, primary_key=True, autoincrement=True)
    copy_id = Column(Integer, ForeignKey("bookcopy.copy_id"), nullable=False)
    user_id = Column(Integer, ForeignKey("user.user_id"), nullable=False)
    borrow_date = Column(DateTime)
    return_date = Column(DateTime)
    status = Column(String(20))

    # relationships
    user = relationship("User", back_populates="borrow_records")
    book_copy = relationship("BookCopy", back_populates="borrow_records")
