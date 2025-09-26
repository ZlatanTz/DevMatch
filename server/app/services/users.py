from sqlalchemy import select
from sqlalchemy.orm import selectinload
from app.models import User
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import HTTPException

from app.schemas.user import UserUpdate

async def list_users(db: AsyncSession):
    result = await db.execute(
        select(User).options(selectinload(User.role))
    )
    return result.scalars().all()

async def get_user(id: int, db: AsyncSession):
    result = await db.execute(
        select(User)
        .options(selectinload(User.role))
        .where(User.id == id)
    )
    user = result.scalars().first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return user

async def user_update(id: int, user_update: UserUpdate, db: AsyncSession):
    user = await get_user(id, db)
    
    for key, value in user_update.model_dump(exclude_unset=True).items():
        setattr(user, key, value)

    await db.commit()
    await db.refresh(user)

    return user

async def delete_user(id: int, db: AsyncSession):
    user = await get_user(id, db)

    await db.delete(user)
    await db.commit()

    return {"detail": f"User {id} deleted successfully"}
