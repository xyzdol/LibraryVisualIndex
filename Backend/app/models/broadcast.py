from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base


class Broadcast(Base):
    __tablename__ = "broadcast"

    broadcast_id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("user.user_id"), nullable=False)
    area_id = Column(Integer, ForeignKey("area.area_id"), nullable=False)
    type = Column(String(20))
    content = Column(Text)
    is_anonymous = Column(Boolean)
    created_at = Column(DateTime)
    expire_at = Column(DateTime)
    is_active = Column(Boolean)

    # relationships
    user = relationship("User", back_populates="broadcasts")
    area = relationship("Area", back_populates="broadcasts")
