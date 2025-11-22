from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.orm import relationship
from app.database import Base
from sqlalchemy.sql import func

class User(Base):
    __tablename__ = "user"

    user_id = Column(Integer, primary_key=True, autoincrement=True)
    username = Column(String(50), nullable=False)
    password_hash = Column(String(255), nullable=False)
    real_name = Column(String(100))
    role = Column(String(20))
    status = Column(String(20))
    created_at = Column(DateTime, nullable=False, server_default=func.now())


    # relationships
    comments = relationship("Comment", back_populates="user")
    borrow_records = relationship("BorrowRecord", back_populates="user")
    broadcasts = relationship("Broadcast", back_populates="user")
