from pydantic import BaseModel

class ShelfBase(BaseModel):
    area_id: int
    code: str
    pos_x: int
    pos_y: int
    description: str | None = None


class ShelfCreate(ShelfBase):
    pass


class ShelfUpdate(BaseModel):
    area_id: int | None = None
    code: str | None = None
    pos_x: int | None = None
    pos_y: int | None = None
    description: str | None = None


class ShelfOut(ShelfBase):
    shelf_id: int

    class Config:
        from_attributes = True
