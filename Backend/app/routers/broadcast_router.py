from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.database import SessionLocal

from app.schemas.broadcast import BroadcastCreate, BroadcastOut
from app.crud import broadcast as crud_broadcast

router = APIRouter(prefix="/broadcasts", tags=["Broadcasts"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get("/", response_model=list[BroadcastOut])
def list_broadcasts(
    area_id: str | None = Query(None, description="int 或 'all'"),
    db: Session = Depends(get_db)
):

    if area_id is None or area_id == "all":
        return crud_broadcast.get_broadcasts(db, None)

    try:
        parsed_area = int(area_id)
    except:
        return crud_broadcast.get_broadcasts(db, None)

    return crud_broadcast.get_broadcasts(db, parsed_area)


@router.post("/", response_model=BroadcastOut)
def create_broadcast(data: BroadcastCreate, db: Session = Depends(get_db)):
    return crud_broadcast.create_broadcast(db, data)


@router.delete("/{broadcast_id}")
def delete_broadcast(broadcast_id: int, db: Session = Depends(get_db)):
    ok = crud_broadcast.delete_broadcast(db, broadcast_id)
    return {"ok": ok}
