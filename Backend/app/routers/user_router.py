from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import SessionLocal
from app.schemas.user import UserCreate, UserOut, UserUpdate, UserList
from app.crud import user as crud_user


router = APIRouter(tags=["Users"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# ---------------------------
# 创建用户
# ---------------------------
@router.post("/", response_model=UserOut)
def create_user(data: UserCreate, db: Session = Depends(get_db)):
    existing = crud_user.get_user_by_username(db, data.username)
    if existing:
        raise HTTPException(status_code=400, detail="Username already exists")
    return crud_user.create_user(db, data)


# ---------------------------
# 获取用户
# ---------------------------
@router.get("/{user_id}", response_model=UserOut)
def read_user(user_id: int, db: Session = Depends(get_db)):
    user = crud_user.get_user(db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


# ---------------------------
# 更新用户
# ---------------------------
@router.put("/{user_id}", response_model=UserOut)
def update_user(user_id: int, data: UserUpdate, db: Session = Depends(get_db)):
    updated = crud_user.update_user(db, user_id, data)
    if not updated:
        raise HTTPException(status_code=404, detail="User not found")
    return updated


# ---------------------------
# 删除用户
# ---------------------------
@router.delete("/{user_id}")
def delete_user(user_id: int, db: Session = Depends(get_db)):
    success = crud_user.delete_user(db, user_id)
    if not success:
        raise HTTPException(status_code=404, detail="User not found")
    return {"message": "User deleted"}


# ---------------------------
# 获取所有用户（分页）
# ---------------------------
@router.get("/", response_model=UserList)
def list_users(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    total, users = crud_user.list_users(db, skip=skip, limit=limit)
    return UserList(total=total, users=users)
