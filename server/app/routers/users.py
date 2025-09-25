from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.core import get_db
from app.schemas import UserRead, UserUpdate
from app.services.users import list_users, get_user, user_update, delete_user

router = APIRouter()

@router.get("/{id}", response_model=UserRead)
async def get_user_by_id(id: int, db: AsyncSession = Depends(get_db)):
    return await get_user(id, db)

@router.put("/{id}", response_model=UserRead)
async def update_user_by_id(id: int, user_change: UserUpdate, db: AsyncSession = Depends(get_db)):
    return await user_update(id, user_change, db)

@router.delete("/{id}")
async def delete_user_by_id(id: int, db: AsyncSession = Depends(get_db)):
    return await delete_user(id, db)

#DEFAULT ROUTES
@router.get("/", response_model=list[UserRead])
async def get_users(db: AsyncSession = Depends(get_db)):
    return await list_users(db)

