from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.schemas.shelf import ShelfCreate, ShelfUpdate, ShelfOut
from app.crud import shelf as crud_shelf

router = APIRouter(prefix="/shelves", tags=["Shelves"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get("/", response_model=list[ShelfOut])
def list_shelves(area_id: int | None = None, db: Session = Depends(get_db)):
    return crud_shelf.list_shelves(db, area_id)



@router.post("/", response_model=ShelfOut)
def create_shelf(data: ShelfCreate, db: Session = Depends(get_db)):
    return crud_shelf.create_shelf(db, data)


@router.get("/{shelf_id}", response_model=ShelfOut)
def read_shelf(shelf_id: int, db: Session = Depends(get_db)):
    shelf = crud_shelf.get_shelf(db, shelf_id)
    if not shelf:
        raise HTTPException(status_code=404, detail="Shelf not found")
    return shelf


@router.put("/{shelf_id}", response_model=ShelfOut)
def update_shelf(shelf_id: int, data: ShelfUpdate, db: Session = Depends(get_db)):
    shelf = crud_shelf.update_shelf(db, shelf_id, data)
    if not shelf:
        raise HTTPException(status_code=404, detail="Shelf not found")
    return shelf


@router.delete("/{shelf_id}")
def delete_shelf(shelf_id: int, db: Session = Depends(get_db)):
    ok = crud_shelf.delete_shelf(db, shelf_id)
    if not ok:
        raise HTTPException(status_code=404, detail="Shelf not found")
    return {"message": "Shelf deleted"}
