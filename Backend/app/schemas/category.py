from pydantic import BaseModel, Field

class CategoryBase(BaseModel):
    name: str = Field(..., max_length=100)
    color_hex: str = Field(..., max_length=7)
    parent_id: int | None = None


class CategoryCreate(CategoryBase):
    pass


class CategoryUpdate(BaseModel):
    name: str | None = None
    color_hex: str | None = None
    parent_id: int | None = None


class CategoryOut(CategoryBase):
    category_id: int

    class Config:
        from_attributes = True
