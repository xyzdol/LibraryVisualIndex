from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import SessionLocal
from app.schemas.comment import CommentCreate, CommentOut
from app.crud import comment as crud_comment


router = APIRouter(prefix="/comments", tags=["Comments"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/", response_model=CommentOut)
def create_comment(data: CommentCreate, db: Session = Depends(get_db)):
    return crud_comment.create_comment(db, data)


@router.get("/book/{book_id}", response_model=list[CommentOut])
def list_comments(book_id: int, db: Session = Depends(get_db)):
    comments = crud_comment.get_comments_by_book(db, book_id)

    # 👉 匿名处理：隐藏 user_id
    for c in comments:
        if c.is_anonymous:
            c.user_id = None

    return comments


@router.delete("/{comment_id}")
def delete_comment(comment_id: int, db: Session = Depends(get_db)):
    ok = crud_comment.delete_comment(db, comment_id)
    if not ok:
        raise HTTPException(status_code=404, detail="Comment not found")
    return {"message": "Comment deleted"}
