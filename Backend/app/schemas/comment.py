from pydantic import BaseModel
from datetime import datetime

class CommentBase(BaseModel):
    book_id: int
    user_id: int
    content: str
    is_anonymous: bool = False


class CommentCreate(CommentBase):
    pass


class CommentOut(BaseModel):
    comment_id: int
    book_id: int
    user_id: int | None   # 匿名时返回 None
    content: str
    is_anonymous: bool
    created_at: datetime

    class Config:
        from_attributes = True
