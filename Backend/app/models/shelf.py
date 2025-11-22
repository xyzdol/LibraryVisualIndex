from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base


class Shelf(Base):
    __tablename__ = "shelf"

    shelf_id = Column(Integer, primary_key=True, autoincrement=True)
    area_id = Column(Integer, ForeignKey("area.area_id"), nullable=False)
    code = Column(String(50), nullable=False)
    pos_x = Column(Integer, nullable=False)
    pos_y = Column(Integer, nullable=False)
    description = Column(String(255))

    # relationships
    area = relationship("Area", back_populates="shelves")
    book_copies = relationship("BookCopy", back_populates="shelf")
