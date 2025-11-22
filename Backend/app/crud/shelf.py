from sqlalchemy.orm import Session
from app.models.shelf import Shelf
from app.schemas.shelf import ShelfCreate, ShelfUpdate

def list_shelves(db: Session):
    return db.query(Shelf).all()

def get_shelf(db: Session, shelf_id: int):
    return db.query(Shelf).filter(Shelf.shelf_id == shelf_id).first()

def create_shelf(db: Session, data: ShelfCreate):
    shelf = Shelf(**data.dict())
    db.add(shelf)
    db.commit()
    db.refresh(shelf)
    return shelf

def update_shelf(db: Session, shelf_id: int, data: ShelfUpdate):
    shelf = get_shelf(db, shelf_id)
    if not shelf:
        return None
    for k, v in data.dict(exclude_unset=True).items():
        setattr(shelf, k, v)
    db.commit()
    db.refresh(shelf)
    return shelf

def delete_shelf(db: Session, shelf_id: int):
    shelf = get_shelf(db, shelf_id)
    if not shelf:
        return None
    db.delete(shelf)
    db.commit()
    return True
