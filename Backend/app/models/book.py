from sqlalchemy import Column, Integer, String, Text, Date, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base


class Book(Base):
    __tablename__ = "book"

    book_id = Column(Integer, primary_key=True, autoincrement=True)
    title = Column(String(255), nullable=False)
    author = Column(String(255), nullable=False)
    publisher = Column(String(255), nullable=False)
    isbn = Column(String(20), nullable=False)
    category_id = Column(Integer, ForeignKey("category.category_id"))
    summary = Column(Text)
    publish_year = Column(Integer)
    cover_image_url = Column(String(500))

    # relationships
    category = relationship("Category", back_populates="books")
    book_copies = relationship("BookCopy", back_populates="book")
    comments = relationship("Comment", back_populates="book")
