from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class BroadcastBase(BaseModel):
    user_id: int
    area_id: int
    type: Optional[str] = None
    content: Optional[str] = None
    is_anonymous: bool = True
    expire_at: Optional[datetime] = None
    is_active: bool = True


class BroadcastCreate(BroadcastBase):
    pass


class BroadcastUpdate(BaseModel):
    user_id: Optional[int] = None
    area_id: Optional[int] = None
    type: Optional[str] = None
    content: Optional[str] = None
    is_anonymous: Optional[bool] = None
    expire_at: Optional[datetime] = None
    is_active: Optional[bool] = None


class BroadcastOut(BroadcastBase):
    broadcast_id: int
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True
