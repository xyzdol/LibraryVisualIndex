from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class UserBase(BaseModel):
    username: str
    real_name: Optional[str] = None
    role: Optional[str] = None
    status: Optional[str] = None


class UserCreate(UserBase):
    password: str


class UserUpdate(BaseModel):
    real_name: Optional[str] = None
    role: Optional[str] = None
    status: Optional[str] = None


class UserOut(UserBase):
    user_id: int
    created_at: datetime

    class Config:
        orm_mode = True

class UserList(BaseModel):
    total: int
    users: list[UserOut]

    model_config = {
        "from_attributes": True
    }
class LoginRequest(BaseModel):
    username: str
    password: str
