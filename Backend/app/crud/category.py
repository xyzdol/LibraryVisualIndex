from sqlalchemy.orm import Session
from app.models.category import Category
from app.schemas.category import CategoryCreate, CategoryUpdate


# Create
def create_category(db: Session, data: CategoryCreate):
    db_item = Category(**data.dict())
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item


# Read all
def get_categories(db: Session):
    return db.query(Category).all()


# Read one
def get_category(db: Session, category_id: int):
    return db.query(Category).filter(Category.category_id == category_id).first()


# Update
def update_category(db: Session, category_id: int, data: CategoryUpdate):
    db_item = get_category(db, category_id)
    if not db_item:
        return None
    for attr, value in data.dict(exclude_unset=True).items():
        setattr(db_item, attr, value)
    db.commit()
    db.refresh(db_item)
    return db_item


# Delete
def delete_category(db: Session, category_id: int):
    db_item = get_category(db, category_id)
    if not db_item:
        return None
    db.delete(db_item)
    db.commit()
    return True
