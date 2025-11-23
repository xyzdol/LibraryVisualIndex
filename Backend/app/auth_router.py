from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import SessionLocal
from app.schemas.user import UserCreate, UserOut, LoginRequest
from app.crud import user as crud_user


router = APIRouter(prefix="/auth", tags=["Auth"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# ---------------------------
# 注册接口（给前端用）
# ---------------------------
@router.post("/register", response_model=UserOut)
def register(data: UserCreate, db: Session = Depends(get_db)):
    existing = crud_user.get_user_by_username(db, data.username)
    if existing:
        raise HTTPException(status_code=400, detail="Username already exists")

    user = crud_user.create_user(db, data)
    return user


# ---------------------------
# 登录接口（密码校验）
# ---------------------------
@router.post("/login")
def login(data: LoginRequest, db: Session = Depends(get_db)):
    user = crud_user.get_user_by_username(db, data.username)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid username or password")

    # 校验 SHA256
    hashed_input = crud_user.hash_password(data.password)
    if hashed_input != user.password_hash:
        raise HTTPException(status_code=401, detail="Invalid username or password")

    # 登录成功 → 返回用户信息
    return {
        "user": {
            "user_id": user.user_id,
            "username": user.username,
            "real_name": user.real_name,
            "role": user.role,
            "status": user.status,
            "created_at": user.created_at,
        }
    }
