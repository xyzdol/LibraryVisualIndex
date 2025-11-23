from fastapi import FastAPI
from .database import engine, Base
from app.routers import user_router   # ⭐ 新增：引入 user_router
from app.routers.category_router import router as category_router
from app.routers.book_router import router as book_router
from app.routers.bookcopy_router import router as bookcopy_router
from app.routers import borrowrecord_router
from app.routers.comment_router import router as comment_router
from app.routers.area_router import router as area_router
from app.routers.shelf_router import router as shelf_router
from app.routers.broadcast_router import router as broadcast_router
from fastapi.middleware.cors import CORSMiddleware
from app import auth_router






app = FastAPI(title="Library Visual Index API")

# 自动创建表（仅开发环境使用）
Base.metadata.create_all(bind=engine)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ⭐ 挂载 user_router
app.include_router(user_router.router, prefix="/users")
app.include_router(category_router, prefix="/categories")
app.include_router(book_router, prefix="/books", tags=["Books"])
app.include_router(bookcopy_router)
app.include_router(borrowrecord_router.router)
app.include_router(comment_router)
app.include_router(area_router)
app.include_router(shelf_router)
app.include_router(broadcast_router)
app.include_router(auth_router.router)

@app.get("/")
def root():
    return {"message": "Library Visual Index API is running!"}
