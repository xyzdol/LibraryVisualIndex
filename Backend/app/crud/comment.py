from sqlalchemy.orm import Session

from app.models.comment import Comment
from app.schemas.comment import CommentCreate


def create_comment(db: Session, data: CommentCreate):
    new_comment = Comment(
        book_id=data.book_id,
        user_id=data.user_id,
        content=data.content,
        is_anonymous=data.is_anonymous
    )
    db.add(new_comment)
    db.commit()
    db.refresh(new_comment)
    return new_comment


def get_comments_by_book(db: Session, book_id: int):
    return db.query(Comment).filter(Comment.book_id == book_id).order_by(Comment.created_at.desc()).all()


def delete_comment(db: Session, comment_id: int):
    comment = db.query(Comment).filter(Comment.comment_id == comment_id).first()
    if not comment:
        return None
    db.delete(comment)
    db.commit()
    return True
