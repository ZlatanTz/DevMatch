from fastapi import FastAPI #, Depends
from sqlalchemy.ext.asyncio import AsyncSession
# from sqlalchemy import select

"""
from app.database import get_db
from app.schemas.user import UserRead
"""

app = FastAPI()

@app.get("/")
async def root():
    return {"message": "Hello World"}

"""
# @app.get("/users/{user_id}", response_model=UserRead)
# async def get_user(user_id: int, db: AsyncSession = Depends(get_db)):
#     result = await db.execute(select(User).where(User.id == user_id))
#     user = result.scalar_one_or_none()
#     if not user:
#         return {"id": 0, "role": "N/A", "email": "notfound@example.com"} 
#     return user

# @app.get("/ping")
# def ping():
#     return {"ok": True}
"""