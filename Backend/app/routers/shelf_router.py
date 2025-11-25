# app/routers/shelf_router.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.schemas.shelf import ShelfCreate, ShelfUpdate, ShelfOut
from app.crud import shelf as crud_shelf
from app.models.shelf import Shelf
from app.models.area import Area

router = APIRouter(prefix="/shelves", tags=["Shelves"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# ✅ 1. 先注册 /map 这个固定路径
@router.get("/map")
def get_shelf_map(db: Session = Depends(get_db)):
    """
    返回所有书架的地图数据：包含区域名、楼层、坐标、说明等
    """
    rows = (
        db.query(
            Shelf.shelf_id,
            Shelf.area_id,
            Shelf.code,
            Shelf.pos_x,
            Shelf.pos_y,
            Shelf.description,
            Area.name.label("area_name"),
            Area.floor.label("floor"),
        )
        .join(Area, Shelf.area_id == Area.area_id)
        .all()
    )

    result = []
    for r in rows:
        result.append(
            {
                "shelf_id": r.shelf_id,
                "area_id": r.area_id,
                "code": r.code,
                "pos_x": r.pos_x,
                "pos_y": r.pos_y,
                "description": r.description,
                "area_name": r.area_name,
                "floor": r.floor,
            }
        )
    return result


# ✅ 2. 再是带参数的路径

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
