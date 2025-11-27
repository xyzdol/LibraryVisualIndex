from sqlalchemy.orm import Session
from sqlalchemy import desc
from datetime import datetime
from app.models.broadcast import Broadcast
from app.schemas.broadcast import BroadcastCreate


def create_broadcast(db: Session, data: BroadcastCreate):
    new_b = Broadcast(
        user_id=data.user_id,
        area_id=data.area_id,
        title=data.title,
        content=data.content,
        is_anonymous=data.is_anonymous,
        created_at=datetime.now()  # ⭐ 强制刷新 created_at，避免 NULL
    )
    db.add(new_b)
    db.commit()
    db.refresh(new_b)
    return new_b


def get_broadcasts(db: Session, area_id: int | None = None):

    query = db.query(Broadcast)

    # ⭐ 仅 area_id 不是 None 且是有效数字时才过滤
    if isinstance(area_id, int):
        query = query.filter(Broadcast.area_id == area_id)

    return (
        query
        .order_by(
            desc(Broadcast.created_at.is_(None)),   # NULL 放最后
            desc(Broadcast.created_at)
        )
        .all()
    )


def delete_broadcast(db: Session, broadcast_id: int):
    b = db.query(Broadcast).filter(Broadcast.broadcast_id == broadcast_id).first()
    if not b:
        return False

    db.delete(b)
    db.commit()
    return True
