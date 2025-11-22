from sqlalchemy import Column, Integer, String, Text
from sqlalchemy.orm import relationship
from app.database import Base


class Area(Base):
    __tablename__ = "area"

    area_id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(100), nullable=False)
    floor = Column(Integer, nullable=False)
    description = Column(Text)

    # relationships
    shelves = relationship("Shelf", back_populates="area")
    broadcasts = relationship("Broadcast", back_populates="area")
