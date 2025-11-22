from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.schemas.broadcast import BroadcastCreate, BroadcastUpdate, BroadcastOut
from app.crud import broadcast as crud_broadcast

router = APIRouter(prefix="/broadcasts", tags=["Broadcasts"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get("/", response_model=list[BroadcastOut])
def list_broadcasts(db: Session = Depends(get_db)):
    return crud_broadcast.list_broadcasts(db)


@router.post("/", response_model=BroadcastOut)
def create_broadcast(data: BroadcastCreate, db: Session = Depends(get_db)):
    return crud_broadcast.create_broadcast(db, data)


@router.get("/{broadcast_id}", response_model=BroadcastOut)
def read_broadcast(broadcast_id: int, db: Session = Depends(get_db)):
    b = crud_broadcast.get_broadcast(db, broadcast_id)
    if not b:
        raise HTTPException(status_code=404, detail="Broadcast not found")
    return b


@router.put("/{broadcast_id}", response_model=BroadcastOut)
def update_broadcast(broadcast_id: int, data: BroadcastUpdate, db: Session = Depends(get_db)):
    b = crud_broadcast.update_broadcast(db, broadcast_id, data)
    if not b:
        raise HTTPException(status_code=404, detail="Broadcast not found")
    return b


@router.delete("/{broadcast_id}")
def delete_broadcast(broadcast_id: int, db: Session = Depends(get_db)):
    ok = crud_broadcast.delete_broadcast(db, broadcast_id)
    if not ok:
        raise HTTPException(status_code=404, detail="Broadcast not found")
    return {"message": "Broadcast deleted"}
