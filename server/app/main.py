from fastapi import FastAPI, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.core import get_db
from app.models import User, Role

from app.models import Role
from app.schemas import RoleRead

app = FastAPI()

@app.get("/")
async def root():
    return {"message": "Hello World"}

@app.get("/roles", response_model=list[RoleRead])
async def get_roles(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Role))
    roles = result.scalars().all()
    return roles

@app.get("/users")
async def get_users(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User))
    users = result.scalars().all()
    return users



