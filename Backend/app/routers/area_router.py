from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.schemas.area import AreaCreate, AreaUpdate, AreaOut
from app.crud import area as crud_area

router = APIRouter(prefix="/areas", tags=["Areas"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/", response_model=list[AreaOut])
def list_areas(db: Session = Depends(get_db)):
    return crud_area.list_areas(db)

@router.post("/", response_model=AreaOut)
def create_area(data: AreaCreate, db: Session = Depends(get_db)):
    return crud_area.create_area(db, data)

@router.get("/{area_id}", response_model=AreaOut)
def read_area(area_id: int, db: Session = Depends(get_db)):
    area = crud_area.get_area(db, area_id)
    if not area:
        raise HTTPException(status_code=404, detail="Area not found")
    return area

@router.put("/{area_id}", response_model=AreaOut)
def update_area(area_id: int, data: AreaUpdate, db: Session = Depends(get_db)):
    area = crud_area.update_area(db, area_id, data)
    if not area:
        raise HTTPException(status_code=404, detail="Area not found")
    return area

@router.delete("/{area_id}")
def delete_area(area_id: int, db: Session = Depends(get_db)):
    ok = crud_area.delete_area(db, area_id)
    if not ok:
        raise HTTPException(status_code=404, detail="Area not found")
    return {"message": "Area deleted"}
