from sqlalchemy import Column, Integer, Text, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime

from app.database import Base


class Comment(Base):
    __tablename__ = "comment"

    comment_id = Column(Integer, primary_key=True, autoincrement=True)

    book_id = Column(Integer, ForeignKey("book.book_id"), nullable=False)
    user_id = Column(Integer, ForeignKey("user.user_id"), nullable=False)

    content = Column(Text, nullable=False)
    is_anonymous = Column(Boolean, default=False)

    created_at = Column(DateTime, default=datetime.now)

    # relationships
    book = relationship("Book", back_populates="comments")
    user = relationship("User", back_populates="comments")
