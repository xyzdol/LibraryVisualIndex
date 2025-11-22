from sqlalchemy.orm import Session
from app.models.area import Area
from app.schemas.area import AreaCreate, AreaUpdate

def list_areas(db: Session):
    return db.query(Area).all()

def get_area(db: Session, area_id: int):
    return db.query(Area).filter(Area.area_id == area_id).first()

def create_area(db: Session, data: AreaCreate):
    area = Area(**data.dict())
    db.add(area)
    db.commit()
    db.refresh(area)
    return area

def update_area(db: Session, area_id: int, data: AreaUpdate):
    area = get_area(db, area_id)
    if not area:
        return None
    for k, v in data.dict(exclude_unset=True).items():
        setattr(area, k, v)
    db.commit()
    db.refresh(area)
    return area

def delete_area(db: Session, area_id: int):
    area = get_area(db, area_id)
    if not area:
        return None
    db.delete(area)
    db.commit()
    return True
