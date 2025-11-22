from sqlalchemy.orm import Session
from app.models.user import User
from app.schemas.user import UserCreate, UserUpdate
import hashlib


def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode("utf-8")).hexdigest()


# Create user
def create_user(db: Session, data: UserCreate):
    hashed_password = hash_password(data.password)
    db_user = User(
        username=data.username,
        password_hash=hashed_password,
        real_name=data.real_name,
        role=data.role,
        status=data.status,
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


# Get user by ID
def get_user(db: Session, user_id: int):
    return db.query(User).filter(User.user_id == user_id).first()


# Get user by username
def get_user_by_username(db: Session, username: str):
    return db.query(User).filter(User.username == username).first()


# Update user
def update_user(db: Session, user_id: int, data: UserUpdate):
    db_user = get_user(db, user_id)
    if not db_user:
        return None

    update_data = data.dict(exclude_unset=True)
    if "password" in update_data:
        update_data["password_hash"] = hash_password(update_data["password"])
        del update_data["password"]

    for key, value in update_data.items():
        setattr(db_user, key, value)

    db.commit()
    db.refresh(db_user)
    return db_user


# Delete user
def delete_user(db: Session, user_id: int):
    db_user = get_user(db, user_id)
    if not db_user:
        return None
    db.delete(db_user)
    db.commit()
    return True
