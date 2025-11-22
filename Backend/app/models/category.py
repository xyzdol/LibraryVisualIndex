from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base


class Category(Base):
    __tablename__ = "category"

    category_id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(100), nullable=False)
    color_hex = Column(String(7), nullable=False)
    parent_id = Column(Integer, ForeignKey("category.category_id"))

    # relationships
    parent = relationship("Category", remote_side=[category_id])
    books = relationship("Book", back_populates="category")
