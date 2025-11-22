from sqlalchemy.orm import Session
from app.models.broadcast import Broadcast
from app.schemas.broadcast import BroadcastCreate, BroadcastUpdate


def list_broadcasts(db: Session):
    return db.query(Broadcast).all()


def get_broadcast(db: Session, broadcast_id: int):
    return db.query(Broadcast).filter(Broadcast.broadcast_id == broadcast_id).first()


def create_broadcast(db: Session, data: BroadcastCreate):
    broadcast = Broadcast(**data.dict())
    db.add(broadcast)
    db.commit()
    db.refresh(broadcast)
    return broadcast


def update_broadcast(db: Session, broadcast_id: int, data: BroadcastUpdate):
    broadcast = get_broadcast(db, broadcast_id)
    if not broadcast:
        return None

    for k, v in data.dict(exclude_unset=True).items():
        setattr(broadcast, k, v)

    db.commit()
    db.refresh(broadcast)
    return broadcast


def delete_broadcast(db: Session, broadcast_id: int):
    broadcast = get_broadcast(db, broadcast_id)
    if not broadcast:
        return None

    db.delete(broadcast)
    db.commit()
    return True
