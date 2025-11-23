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
# 注册接口（前后端都需要校验）
# ---------------------------
@router.post("/register", response_model=UserOut)
def register(data: UserCreate, db: Session = Depends(get_db)):
    # 后端校验：不能为空
    if not data.username.strip() or not data.password.strip():
        raise HTTPException(status_code=400, detail="Username and password cannot be empty")

    existing = crud_user.get_user_by_username(db, data.username)
    if existing:
        raise HTTPException(status_code=400, detail="Username already exists")

    return crud_user.create_user(db, data)


# ---------------------------
# 登录接口（严格密码校验）
# ---------------------------
@router.post("/login")
def login(data: LoginRequest, db: Session = Depends(get_db)):
    # 后端校验：不能为空
    if not data.username.strip() or not data.password.strip():
        raise HTTPException(status_code=400, detail="Username or password cannot be empty")

    user = crud_user.get_user_by_username(db, data.username)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid username or password")

    hashed_input = crud_user.hash_password(data.password)
    if hashed_input != user.password_hash:
        raise HTTPException(status_code=401, detail="Invalid username or password")

    # ⭐ 返回纯用户对象，而不是 {user: {...}}
    return {
        "user_id": user.user_id,
        "username": user.username,
        "real_name": user.real_name,
        "role": user.role,
        "status": user.status,
        "created_at": user.created_at,
    }
