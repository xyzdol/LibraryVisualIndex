from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class BroadcastBase(BaseModel):
    user_id: int
    area_id: int
    title: str
    content: str
    is_anonymous: bool = False


class BroadcastCreate(BroadcastBase):
    pass


class BroadcastOut(BaseModel):
    broadcast_id: int
    user_id: int | None
    area_id: int
    title: str
    content: str
    is_anonymous: bool
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True
