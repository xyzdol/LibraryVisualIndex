from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.schemas.category import CategoryCreate, CategoryOut, CategoryUpdate
from app.crud import category as crud_category

router = APIRouter(tags=["Category"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/", response_model=CategoryOut)
def create_category(data: CategoryCreate, db: Session = Depends(get_db)):
    return crud_category.create_category(db, data)


@router.get("/", response_model=list[CategoryOut])
def list_categories(db: Session = Depends(get_db)):
    return crud_category.get_categories(db)


@router.get("/{category_id}", response_model=CategoryOut)
def read_category(category_id: int, db: Session = Depends(get_db)):
    item = crud_category.get_category(db, category_id)
    if not item:
        raise HTTPException(status_code=404, detail="Category not found")
    return item


@router.put("/{category_id}", response_model=CategoryOut)
def update_category(category_id: int, data: CategoryUpdate, db: Session = Depends(get_db)):
    updated = crud_category.update_category(db, category_id, data)
    if not updated:
        raise HTTPException(status_code=404, detail="Category not found")
    return updated


@router.delete("/{category_id}")
def delete_category(category_id: int, db: Session = Depends(get_db)):
    ok = crud_category.delete_category(db, category_id)
    if not ok:
        raise HTTPException(status_code=404, detail="Category not found")
    return {"message": "Category deleted"}
