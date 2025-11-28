from pydantic import BaseModel

class AreaBase(BaseModel):
    name: str
    floor: int
    description: str | None = None

class AreaCreate(AreaBase):
    pass

class AreaUpdate(BaseModel):
    name: str | None = None
    floor: int | None = None
    description: str | None = None

class AreaOut(AreaBase):
    area_id: int
    visit_count: int = 0  

    class Config:
        from_attributes = True

